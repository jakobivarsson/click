package main

import (
	"github.com/jakobivarsson/click/server/click"
)

func main() {
	DB := click.GetDB()
	DB.Open("click.db")
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
