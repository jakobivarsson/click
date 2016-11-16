package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"golang.org/x/net/websocket"
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

func (s *Server) createCounter(name string, count int, clicks int) *Counter {
	counter := NewCounter(name, count, clicks)
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
		count := db.GetLastEntry(l, BucketCount)
		clicks := db.GetLastEntry(l, BucketClick)
		counter := server.createCounter(l, int(count), int(clicks))
		counter.Subscribe <- dbclient
	}
	go server.Run()
	http.Handle("/ws", auth(http.HandlerFunc(connectionHandler)))
	http.Handle("/stats", auth(http.HandlerFunc(statsHandler)))
	err := http.ListenAndServe(":3001", nil)
	fmt.Println("Server error:", err)
}

func connectionHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("New client")
	s := websocket.Server{Handler: websocket.Handler(wsHandler)}
	s.ServeHTTP(w, r)
}

func wsHandler(ws *websocket.Conn) {
	client := NewClient(ws, &server)
	client.Listen()
}

func auth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query()
		user := query.Get("username")
		pass := query.Get("password")
		if AuthenticateUser(user, pass) {
			next.ServeHTTP(w, r)
		}
	})
}

type dataPoint struct {
	Time  int64 `json:"time"`
	Value int64 `json:"value"`
}

type buildingStats struct {
	Name   string      `json:"name"`
	Clicks []dataPoint `json:"clicks"`
	Counts []dataPoint `json:"counts"`
}

func statsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	query := r.URL.Query()
	fromi, err := strconv.ParseInt(query.Get("from"), 10, 64)
	if err != nil {
		http.Error(w, "invalid from parameter", http.StatusBadRequest)
		return
	}
	toi, err := strconv.ParseInt(query.Get("to"), 10, 64)
	if err != nil {
		http.Error(w, "invalid to parameter", http.StatusBadRequest)
		return
	}
	from := time.Unix(fromi, 0).Format(time.RFC3339)
	to := time.Unix(toi, 0).Format(time.RFC3339)
	db := GetDB()
	buildings := db.GetLogs()
	response := make([]buildingStats, len(buildings))
	for j, b := range buildings {
		entries := db.GetEntries(b, BucketClick, from, to)
		clicks := make([]dataPoint, len(entries))
		var i int
		for t, value := range entries {
			tt, err := time.Parse(time.RFC3339, t)
			if err != nil {
				http.Error(w, "", http.StatusInternalServerError)
				return
			}
			clicks[i].Time = tt.Unix()
			clicks[i].Value = int64(value)
			i++
		}
		entries = db.GetEntries(b, BucketCount, from, to)
		counts := make([]dataPoint, len(entries))
		i = 0
		for t, value := range entries {
			tt, err := time.Parse(time.RFC3339, t)
			if err != nil {
				http.Error(w, "", http.StatusInternalServerError)
				return
			}
			counts[i].Time = tt.Unix()
			counts[i].Value = int64(value)
			i++
		}
		response[j].Name = b
		response[j].Clicks = clicks
		response[j].Counts = counts
	}
	json.NewEncoder(w).Encode(response)
}
