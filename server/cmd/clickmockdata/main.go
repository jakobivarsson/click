package main

import (
	"github.com/jakobivarsson/click/server/click"
)

func main() {
	DB := click.GetDB()
	DB.Open("click.db")
	defer DB.Close()
	DB.LogClicks("Nymb", 25)
	DB.LogClicks("KTHB", 5)
	click.CreateUser("cake", "ilovesalmon")
}
