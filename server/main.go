// Example with a decoupled bolt adapter
package main

import (
	"math/rand"
	"time"
)

func main() {
	DB := GetDB()
	DB.Open("click.db")
	defer DB.Close()

	rand.Seed(time.Now().UnixNano())
	DB.LogClicks("Cakes place", rand.Uint32())
	DB.LogClicks("This other place", rand.Uint32())
	DB.PrintToday()
}
