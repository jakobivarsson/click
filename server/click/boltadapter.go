package click

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

func (ba *boltAdapter) Open(name string) {
	var fileMode os.FileMode = 0600
	var err error
	ba.db, err = bolt.Open(name, fileMode, nil)
	if err != nil {
		fmt.Println("error opening boltdb ", name, err)
	}
	err = ba.db.Update(func(tx *bolt.Tx) error {
		var err error
		_, err = tx.CreateBucketIfNotExists([]byte("counters"))
		_, err = tx.CreateBucketIfNotExists([]byte("auth"))
		return err
	})
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

func (ba *boltAdapter) LogClicks(counter string, count uint32) {
	err := ba.db.Update(func(tx *bolt.Tx) error {
		var err error
		counters := tx.Bucket([]byte("counters"))
		_, err = counters.CreateBucketIfNotExists([]byte(counter))
		if err != nil {
			return err
		}
		buck := counters.Bucket([]byte(counter))
		err = buck.Put([]byte(time.Now().Format(time.RFC3339)), ui32ToBytes(count))
		return err
	})
	if err != nil {
		fmt.Println("error logging ", counter, err)
	}
}

func beginningOfDay() time.Time {
	t := time.Now()
	y, m, d := t.Date()
	return time.Date(y, m, d, 0, 0, 0, 0, t.Location())
}

// PrintToday prints all the datapoints for all counters for today
func (ba *boltAdapter) PrintToday() {
	to := time.Now().Format(time.RFC3339)
	t := time.Now()
	y, m, d := t.Date()
	from := time.Date(y, m, d, 0, 0, 0, 0, t.Location()).Format(time.RFC3339)
	for c, _ := range ba.GetCounters() {
		fmt.Println(c)
		for k, v := range ba.GetClicks(from, to, c) {
			fmt.Printf("[%s] : %d\n", k, v)
		}
	}
}

// GetClicks takes a time frame in RFC3339 format and a counter
// returns a map of all timestamps in this timeframe
func (ba *boltAdapter) GetClicks(from string, to string, c string) map[string]uint32 {
	m := make(map[string]uint32)
	ba.db.View(func(root *bolt.Tx) error {
		counter := root.Bucket([]byte("counters")).Bucket([]byte(c))
		cursor := counter.Cursor()
		for k, v := cursor.Seek([]byte(from)); k != nil && bytes.Compare(k, []byte(to)) <= 0; k, v = cursor.Next() {
			m[string(k)] = binary.LittleEndian.Uint32(v)
		}
		return nil
	})
	return m
}

func (ba *boltAdapter) GetCounters() map[string]uint32 {
	locs := make(map[string]uint32)
	ba.db.View(func(root *bolt.Tx) error {
		counters := root.Bucket([]byte("counters"))
		cursor := counters.Cursor()
		for k, v := cursor.First(); k != nil; k, v = cursor.Next() {
			// nil value means the key belongs to a bucket and not a value
			if v == nil {
				ck, cv := counters.Bucket(k).Cursor().Last()
				locs[string(k)] = 0
				if ck != nil {
					locs[string(k)] = binary.LittleEndian.Uint32(cv)
				}
			}
		}
		return nil
	})
	return locs
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
		fmt.Println("error creating auth", user, err)
	}
}
