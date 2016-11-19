package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
	"syscall"

	"golang.org/x/crypto/ssh/terminal"
)

func main() {
	arg := os.Args[1:]
	if len(arg) < 1 {
		help()
		return
	}
	dbPath := "click.db"
	if len(arg) == 2 {
		dbPath = arg[1]
	}
	switch arg[0] {
	case "createuser":
		createUser(dbPath)
	case "help":
		help()
	case "init":
		initdb(dbPath)
	case "run":
		run(dbPath)
	default:
		fmt.Println("Invalid argument!")
		help()
	}
}

func createUser(dbPath string) {
	DB := GetDB()
	DB.Open(dbPath)
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

func initdb(dbPath string) {
	DB := GetDB()
	DB.Open(dbPath)
	defer DB.Close()
	DB.LogEntry("Nymble", BucketClick, 0)
	DB.LogEntry("Nymble", BucketCount, 0)
	DB.LogEntry("KTHB", BucketClick, 0)
	DB.LogEntry("KTHB", BucketCount, 0)
	DB.LogEntry("KTH Entré", BucketClick, 0)
	DB.LogEntry("KTH Entré", BucketCount, 0)
	DB.PrintToday("Nymble", BucketClick)
	DB.PrintToday("Nymble", BucketCount)
	DB.PrintToday("KTHB", BucketClick)
	DB.PrintToday("KTHB", BucketCount)
	DB.PrintToday("KTH Entré", BucketClick)
	DB.PrintToday("KTH Entré", BucketCount)
}

func run(dbPath string) {
	fmt.Println("Starting click server")
	RunServer(dbPath)
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
