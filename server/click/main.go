package main

import (
	"bufio"
	"fmt"
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
	DB := GetDB()
	DB.Open()
	defer DB.Close()
	user, pass := credentials()
	CreateUser(user, pass)
	if AuthenticateUser(user, pass) {
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
	DB := GetDB()
	DB.Open()
	defer DB.Close()
	DB.LogEntry("Nymble", BucketClick, 0)
	DB.LogEntry("Nymble", BucketCount, 0)
	DB.LogEntry("KTHB", BucketClick, 0)
	DB.LogEntry("KTHB", BucketCount, 0)
	DB.PrintToday("Nymble", BucketClick)
	DB.PrintToday("Nymble", BucketCount)
	DB.PrintToday("KTHB", BucketClick)
	DB.PrintToday("KTHB", BucketCount)
}

func run() {
	fmt.Println("Starting click server")
	RunServer()
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
