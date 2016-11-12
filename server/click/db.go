package click

import "sync"

type ClickDatabase interface {
	Open(string)
	Close()
	LogClicks(string, uint32)
	PrintToday()
	GetPassword(string) string
	StorePassword(string, string)
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
