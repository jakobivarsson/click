// Example with a decoupled bolt adapter
package main

import (
	"fmt"
	"math/rand"
	"time"
)

func main() {
	DB := GetDB()
	DB.Open("click.db")
	defer DB.Close()

	user := "username"
	pass := "password"
	CreateUser(user, pass)
	fmt.Println(AuthenticateUser(user, pass))

	rand.Seed(time.Now().UnixNano())
	DB.LogClicks("Cakes place", rand.Uint32())
	DB.LogClicks("This other place", rand.Uint32())
	DB.PrintToday()
}
