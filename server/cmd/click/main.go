package main

import (
	"bufio"
	"fmt"
	"github.com/jakobivarsson/click/server/click"
	"golang.org/x/crypto/ssh/terminal"
	"os"
	"strings"
	"syscall"
)

func main() {
	arg := os.Args[1:]
	if len(arg) < 1 {
		help()
		return
	}
	switch arg[0] {
	case "createuser":
		createUser()
	case "help":
		help()
	case "init":
		initdb()
	case "run":
		run()
	default:
		fmt.Println("Invalid argument!")
		help()
	}
}

func createUser() {
	DB := click.GetDB()
	DB.Open()
	defer DB.Close()
	user, pass := credentials()
	click.CreateUser(user, pass)
	if click.AuthenticateUser(user, pass) {
		fmt.Println("User authenticated.")
	} else {
		fmt.Println("User not authenticated.")
	}
}

func help() {
	fmt.Println("createuser\tCreates a user")
	fmt.Println("init      \tInitializes the database")
	fmt.Println("run       \tRuns the server")
}

func initdb() {
	DB := click.GetDB()
	DB.Open()
	defer DB.Close()
	DB.LogEntry("Nymble", "click", 0)
	DB.LogEntry("Nymble", "count", 0)
	DB.LogEntry("KTHB", "click", 0)
	DB.LogEntry("KTHB", "count", 0)
	DB.PrintToday("Nymble", "click")
	DB.PrintToday("Nymble", "count")
	DB.PrintToday("KTHB", "click")
	DB.PrintToday("KTHB", "count")
}

func run() {
	fmt.Println("Starting click server")
	click.RunServer()
}

func credentials() (string, string) {
	reader := bufio.NewReader(os.Stdin)

	fmt.Print("Username: ")
	username, _ := reader.ReadString('\n')

	fmt.Print("Password: ")
	bytePassword, err := terminal.ReadPassword(int(syscall.Stdin))
	if err != nil {
		fmt.Println("Error reading password", err)
		return "", ""
	}
	fmt.Print("\n")
	password := string(bytePassword)
	return strings.TrimSpace(username), strings.TrimSpace(password)
}
