// Example with a decoupled bolt adapter
package main

import (
	"math/rand"
	"time"
)

func main() {
	rand.Seed(time.Now().UnixNano())
	BA.Init("click.db")
	defer BA.Close()
	BA.LogCount("Cakes place", rand.Uint32())
	BA.LogCount("This other place", rand.Uint32())
	BA.AllLocations(PrintToday)
}
