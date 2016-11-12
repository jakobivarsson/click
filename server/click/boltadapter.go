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
		_, err = tx.CreateBucketIfNotExists([]byte("locations"))
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

func (ba *boltAdapter) LogClicks(location string, count uint32) {
	err := ba.db.Update(func(tx *bolt.Tx) error {
		var err error
		locations := tx.Bucket([]byte("locations"))
		_, err = locations.CreateBucketIfNotExists([]byte(location))
		if err != nil {
			return err
		}
		buck := locations.Bucket([]byte(location))
		err = buck.Put([]byte(time.Now().Format(time.RFC3339)), ui32ToBytes(count))
		return err
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

// PrintToday prints all the datapoints for all locations for today
func (ba *boltAdapter) PrintToday() {
	to := time.Now().Format(time.RFC3339)
	t := time.Now()
	y, m, d := t.Date()
	from := time.Date(y, m, d, 0, 0, 0, 0, t.Location()).Format(time.RFC3339)
	for l, _ := range ba.GetLocations() {
		fmt.Println(l)
		for k, v := range ba.GetClicks(from, to, l) {
			fmt.Printf("[%s] : %d\n", k, v)
		}
	}
}

// GetClicks takes a time frame in RFC3339 format and a location
// returns a map of all timestamps in this timeframe
func (ba *boltAdapter) GetClicks(from string, to string, loc string) map[string]uint32 {
	m := make(map[string]uint32)
	ba.db.View(func(root *bolt.Tx) error {
		location := root.Bucket([]byte("locations")).Bucket([]byte(loc))
		cursor := location.Cursor()
		for k, v := cursor.Seek([]byte(from)); k != nil && bytes.Compare(k, []byte(to)) <= 0; k, v = cursor.Next() {
			m[string(k)] = binary.LittleEndian.Uint32(v)
		}
		return nil
	})
	return m
}

func (ba *boltAdapter) GetLocations() map[string]uint32 {
	locs := make(map[string]uint32)
	ba.db.View(func(root *bolt.Tx) error {
		locations := root.Bucket([]byte("locations"))
		cursor := locations.Cursor()
		for k, v := cursor.First(); k != nil; k, v = cursor.Next() {
			// nil value means the key belongs to a bucket and not a value
			if v == nil {
				ck, cv := locations.Bucket(k).Cursor().Last()
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
