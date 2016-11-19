package main

import "sync"

type ClickDatabase interface {
	Open(string)
	Close()
	GetLogs() []string
	LogEntry(string, string, uint32)
	GetLastEntry(string, string) uint32
	GetEntries(string, string, string, string) map[string]uint32
	GetPassword(string) string
	StorePassword(string, string)
	PrintToday(string, string)
}

var (
	db   ClickDatabase
	once sync.Once
)

func GetDB() ClickDatabase {
	once.Do(func() {
		db = &boltAdapter{}
	})
	return db
}
