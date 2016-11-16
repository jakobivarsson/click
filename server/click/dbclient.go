package main

import (
	"time"
)

const (
	BucketCount = "count"
	BucketClick = "click"
)

type counterValues struct {
	value  int
	clicks int
}

// DbClient is a client that writes to the database
type DbClient struct {
	db       ClickDatabase
	Update   chan Message
	server   *Server
	ticker   *time.Ticker
	counters map[string]counterValues
}

// NewDbClient creates a new dbclient
func NewDbClient(server *Server) *DbClient {
	update := make(chan Message)
	counters := make(map[string]counterValues)
	return &DbClient{GetDB(), update, server, time.NewTicker(time.Second * 5), counters}
	//time.Minute * 5)}
}

// Notify notifies the DbClient with e new message
func (c *DbClient) Notify(m Message) {
	c.Update <- m
}

func (c *DbClient) Listen() {
	for {
		select {
		case message, more := <-c.Update:
			if more {
				c.counters[message.Counter] = counterValues{message.Value, message.Clicks}
			} else {
				return
			}
		case _ = <-c.ticker.C:
			// TODO write to database
			for building, values := range c.counters {
				c.db.LogEntry(building, BucketClick, uint32(values.clicks))
				c.db.LogEntry(building, BucketCount, uint32(values.value))
			}
		}
	}
}
