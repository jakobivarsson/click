package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"golang.org/x/net/websocket"
	"net/http"
)

var (
	globalCounter *Counter
	server        Server
)

type Server struct {
	counters map[string]*Counter
}

func NewServer() Server {
	counters := make(map[string]*Counter)
	return Server{counters}
}

func (s *Server) AddCounter(name string) {
	counter := NewCounter()
	s.counters[name] = counter
	go counter.Start()
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

func main() {
	server = NewServer()
	server.AddCounter("Nymble")

	r := mux.NewRouter()
	r.Handle("/counters/{key}", websocket.Handler(wsHandler))
	r.HandleFunc("/counters", getCounters).Methods("GET")
	r.HandleFunc("/counters", postCounters).Methods("POST")

	http.Handle("/", r)
	err := http.ListenAndServe(":8008", nil)
	fmt.Println("Server error:", err)
}

func wsHandler(ws *websocket.Conn) {
	vars := mux.Vars(ws.Request())
	name := vars["key"]
	counter := server.GetCounter(name)
	if counter == nil {
		ws.Close()
		return
	}

	client := NewClient(ws, counter)
	client.Listen()
}

func getCounters(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(server.GetCounterNames())
}

func postCounters(w http.ResponseWriter, r *http.Request) {
	name := r.PostFormValue("name")
	if name == "" {
		http.Error(w, "no name", http.StatusBadRequest)
		return
	}
	if server.GetCounter(name) != nil {
		http.Error(w, "counter already exists!", http.StatusBadRequest)
		return
	}

	server.AddCounter(name)
	w.Header().Add("Access-Control-Allow-Origin", "*")
}
