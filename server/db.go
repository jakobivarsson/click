package main

import "sync"

type ClickDatabase interface {
	Open(string)
	Close()
	LogClicks(string, uint32)
	PrintToday()
	Auth(string) string
	CreateAuthority(string, string)
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
