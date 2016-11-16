package main

import (
	"fmt"
	"golang.org/x/net/websocket"
	"net/http"
)

var (
	server Server
)

type Server struct {
	counters map[string]*Counter
	Message  chan Message
}

func NewServer() Server {
	counters := make(map[string]*Counter)
	message := make(chan Message)
	return Server{counters, message}
}

func (s *Server) Run() {
	for {
		m := <-s.Message
		switch m.Type {
		case TypeClick:
			counter := s.GetCounter(m.Counter)
			if counter == nil {
				continue
			}
			counter.Update <- m
		case TypeSubscribe:
			counter := s.GetCounter(m.Counter)
			if counter == nil {
				continue
			}
			counter.Subscribe <- m.Subscriber
		case TypeUnsubscribe:
			for _, counter := range s.counters {
				counter.Unsubscribe <- m.Subscriber
			}
		case TypeGetCounters:
			response := Message{Type: TypeCounters, Counters: s.GetCounterNames()}
			m.Subscriber.Notify(response)
		}
	}

}

func (s *Server) createCounter(name string, count int) *Counter {
	counter := NewCounter(name, count)
	s.counters[name] = counter
	go counter.Start()
	return counter
}

func (s *Server) GetCounter(name string) *Counter {
	return s.counters[name]
}

func (s *Server) GetCounterNames() []string {
	var keys []string
	for key := range s.counters {
		keys = append(keys, key)
	}
	return keys
}

func RunServer() {
	db := GetDB()
	db.Open()
	defer db.Close()
	server = NewServer()
	dbclient := NewDbClient(&server)
	go dbclient.Listen()
	for _, l := range db.GetLogs() {
		// TODO db.GetLastEntry(l, "count")
		counter := server.createCounter(l, 0)
		counter.Subscribe <- dbclient
	}
	go server.Run()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query()
		user := query.Get("username")
		pass := query.Get("password")
		if AuthenticateUser(user, pass) {
			fmt.Printf("New client: %v\n", user)
			s := websocket.Server{Handler: websocket.Handler(wsHandler)}
			s.ServeHTTP(w, r)
		}
	})
	err := http.ListenAndServe(":3001", nil)
	fmt.Println("Server error:", err)
}

func wsHandler(ws *websocket.Conn) {
	client := NewClient(ws, &server)
	client.Listen()
}
