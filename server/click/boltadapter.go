package main

import (
	"bytes"
	"encoding/binary"
	"fmt"
	"os"
	"time"

	"github.com/boltdb/bolt"
)

type boltAdapter struct {
	db *bolt.DB
}

func (ba *boltAdapter) Open() {
	var fileMode os.FileMode = 0600
	var err error
	ba.db, err = bolt.Open("click.db", fileMode, nil)
	if err != nil {
		fmt.Println("error opening boltdb", err)
	}
	err = ba.db.Update(func(tx *bolt.Tx) error {
		var err error
		_, err = tx.CreateBucketIfNotExists([]byte("logs"))
		_, err = tx.CreateBucketIfNotExists([]byte("auth"))
		return err
	})
	if err != nil {
		fmt.Println("error initializing boltdb", err)
	}
}

func (ba *boltAdapter) Close() {
	ba.db.Close()
}

func ui32ToBytes(i uint32) []byte {
	buf := new(bytes.Buffer)
	binary.Write(buf, binary.LittleEndian, i)
	return []byte(buf.Bytes())
}

// LogEntry creates a timestamp in a given log and chapter
func (ba *boltAdapter) LogEntry(log string, chapter string, num uint32) {
	err := ba.db.Update(func(tx *bolt.Tx) error {
		var err error
		buck := tx.Bucket([]byte("logs"))
		_, err = buck.CreateBucketIfNotExists([]byte(log))
		if err != nil {
			return err
		}
		buck = buck.Bucket([]byte(log))
		_, err = buck.CreateBucketIfNotExists([]byte(chapter))
		if err != nil {
			return err
		}
		buck = buck.Bucket([]byte(chapter))
		err = buck.Put([]byte(time.Now().Format(time.RFC3339)), ui32ToBytes(num))
		return err
	})
	if err != nil {
		fmt.Println("error logging", log, chapter, num, err)
	}
}

func beginningOfDay() time.Time {
	t := time.Now()
	y, m, d := t.Date()
	return time.Date(y, m, d, 0, 0, 0, 0, t.Location())
}

// PrintToday prints all entries for a log and chapter for today
func (ba *boltAdapter) PrintToday(log string, chapter string) {
	to := time.Now().Format(time.RFC3339)
	t := time.Now()
	y, m, d := t.Date()
	from := time.Date(y, m, d, 0, 0, 0, 0, t.Location()).Format(time.RFC3339)
	fmt.Printf("Showing all entries for log \"%s\" chapter \"%s\"\n", log, chapter)
	for k, v := range ba.GetEntries(log, chapter, from, to) {
		fmt.Printf("[%s] : %d\n", k, v)
	}
}

// GetLastEntry returns the latest entry to a log and chapter
func (ba *boltAdapter) GetLastEntry(log string, chapter string) uint32 {
	var entry uint32
	ba.db.View(func(root *bolt.Tx) error {
		cursor := root.Bucket([]byte("logs")).Bucket([]byte(log)).Bucket([]byte(chapter)).Cursor()
		_, v := cursor.Last()
		entry = binary.LittleEndian.Uint32(v)
		return nil
	})
	return entry
}

// GetEntries takes a log, a chapter, and a time frame in RFC3339,
// Returns a map of all timestamps in this timeframe
func (ba *boltAdapter) GetEntries(log string, chapter string, from string, to string) map[string]uint32 {
	m := make(map[string]uint32)
	ba.db.View(func(root *bolt.Tx) error {
		buck := root.Bucket([]byte("logs")).Bucket([]byte(log))
		if buck == nil {
			return nil
		}
		buck = buck.Bucket([]byte(chapter))
		if buck == nil {
			return nil
		}
		cursor := buck.Cursor()
		for k, v := cursor.Seek([]byte(from)); k != nil && bytes.Compare(k, []byte(to)) <= 0; k, v = cursor.Next() {
			m[string(k)] = binary.LittleEndian.Uint32(v)
		}
		return nil
	})
	return m
}

// GetLogs returns an array of all the logs in the database
func (ba *boltAdapter) GetLogs() []string {
	var logs []string
	ba.db.View(func(root *bolt.Tx) error {
		cursor := root.Bucket([]byte("logs")).Cursor()
		for k, v := cursor.First(); k != nil; k, v = cursor.Next() {
			// nil value means the key belongs to a bucket and not a value
			if v == nil {
				logs = append(logs, string(k))
			}
		}
		return nil
	})
	return logs
}

// GetPassword returns the pass associated with the user
func (ba *boltAdapter) GetPassword(user string) string {
	var pass string
	ba.db.View(func(root *bolt.Tx) error {
		auth := root.Bucket([]byte("auth"))
		pass = string(auth.Get([]byte(user)))
		return nil
	})
	return pass
}

// StorePassword stores a user/pass in the database
func (ba *boltAdapter) StorePassword(user string, pass string) {
	err := ba.db.Update(func(root *bolt.Tx) error {
		auth := root.Bucket([]byte("auth"))
		err := auth.Put([]byte(user), []byte(pass))
		return err
	})
	if err != nil {
		fmt.Println("error storing password", err)
	}
}
