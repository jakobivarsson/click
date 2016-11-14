package main

import (
	"github.com/jakobivarsson/click/server/click"
)

func main() {
	DB := click.GetDB()
	DB.Open("click.db")
	defer DB.Close()
	DB.LogEntry("Nymble", "Main Entrance", 0)
	DB.LogEntry("Nymble", "THS Café", 0)
	DB.LogEntry("KTHB", "Main Entrance", 0)
	DB.LogEntry("KTHB", "Back Entrance", 0)
	DB.PrintToday("Nymble", "Main Entrance")
	DB.PrintToday("Nymble", "THS Café")
	DB.PrintToday("KTHB", "Main Entrance")
	DB.PrintToday("KTHB", "Back Entrance")
}
