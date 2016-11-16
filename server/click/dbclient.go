package main

import (
	"fmt"
	"time"
)

// DbClient is a client that writes to the database
type DbClient struct {
	db     ClickDatabase
	Update chan Message
	server *Server
	ticker *time.Ticker
}

// NewDbClient creates a new dbclient
func NewDbClient(server *Server) *DbClient {
	update := make(chan Message)
	return &DbClient{GetDB(), update, server, time.NewTicker(time.Second * 5)}
	//time.Minute * 5)}
}

// Notify notifies the DbClient with e new message
func (c *DbClient) Notify(m Message) {
	c.Update <- m
}

func (c *DbClient) Listen() {
	// TODO get all buildings and save the count and clicks for them all
	for {
		select {
		case message, more := <-c.Update:
			if more {
				// data, err := json.Marshal(message)
				// TODO save the count and/or clicks received
				fmt.Println("saved count and/or clicks", message)
			} else {
				return
			}
		case _ = <-c.ticker.C:
			// TODO write to database
			fmt.Println("logging clicks and count")
		}
	}
}
