// Example with a decoupled bolt adapter
package main

import (
	"fmt"
	"github.com/jakobivarsson/click/server/click"
	"os"
)

func main() {
	DB := click.GetDB()
	DB.Open("click.db")
	defer DB.Close()
	args := os.Args[1:]
	user := args[0]
	pass := args[1]
	click.CreateUser(user, pass)
	if click.AuthenticateUser(user, pass) {
		fmt.Println("User authenticated.")
	} else {
		fmt.Println("User not authenticated.")
	}
}
