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

// BA is the exported adapter for the bolt database
var BA boltAdapter

func (ba *boltAdapter) Init(name string) {
	var fileMode os.FileMode = 0600
	var err error
	ba.db, err = bolt.Open(name, fileMode, nil)
	if err != nil {
		fmt.Println("error opening boltdb ", name, err)
	}

	err = ba.db.Update(func(tx *bolt.Tx) error {
		_, err := tx.CreateBucketIfNotExists([]byte("locations"))
		return err
	})
	// TODO init other
	if err != nil {
		fmt.Println("error initializing boltdb ", name, err)
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

func (ba *boltAdapter) LogCount(location string, count uint32) {
	err := ba.db.Update(func(tx *bolt.Tx) error {
		var err error
		locations := tx.Bucket([]byte("locations"))
		_, err = locations.CreateBucketIfNotExists([]byte(location))
		if err != nil {
			return err
		}
		buck := locations.Bucket([]byte(location))
		if err = buck.Put([]byte(time.Now().Format(time.RFC3339)), ui32ToBytes(count)); err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		fmt.Println("error logging ", location, err)
	}
}

func beginningOfDay() time.Time {
	t := time.Now()
	y, m, d := t.Date()
	return time.Date(y, m, d, 0, 0, 0, 0, t.Location())
}

// PrintToday prints all the datapoints for today
func PrintToday(b *bolt.Bucket) {
	min := []byte(beginningOfDay().Format(time.RFC3339))
	max := []byte(time.Now().Format(time.RFC3339))

	cursor := b.Cursor()
	for k, v := cursor.Seek(min); k != nil && bytes.Compare(k, max) <= 0; k, v = cursor.Next() {
		fmt.Printf("[%s] : %d\n", k, binary.LittleEndian.Uint32(v))
	}
}

// PrintAll prints all values in bucket
func PrintAll(b *bolt.Bucket) {
	cursor := b.Cursor()
	for k, v := cursor.First(); k != nil; k, v = cursor.Next() {
		fmt.Printf("[%s] : %d\n", k, binary.LittleEndian.Uint32(v))
	}
}

func (ba *boltAdapter) Location(location string, fn func(*bolt.Bucket)) {
	ba.db.View(func(root *bolt.Tx) error {
		b := root.Bucket([]byte("locations")).Bucket([]byte(location))
		if b == nil {
			fmt.Println("error:", location, "does not exist")
			return nil
		}
		fn(b)
		return nil
	})
}

func (ba *boltAdapter) AllLocations(fn func(*bolt.Bucket)) {
	ba.db.View(func(root *bolt.Tx) error {
		locations := root.Bucket([]byte("locations"))
		cursor := locations.Cursor()
		for k, v := cursor.First(); k != nil; k, v = cursor.Next() {
			// nil value means the key belongs to a bucket and not a value
			if v == nil {
				fmt.Printf("%s today\n", k)
				fn(locations.Bucket(k))
			}
		}
		return nil
	})
}
