package main

import (
	"fmt"
)

type Counter struct {
	clients []*Client
	Update  chan int
	counter int
}

func NewCounter() *Counter {
	update := make(chan int)
	return &Counter{Update: update}
}

func (c *Counter) notifyClients() {
	for _, client := range c.clients {
		client.Update <- c.counter
	}
}

func (c *Counter) Start() {
	for {
		i := <-c.Update
		if c.counter+i < 0 {
			continue
		}
		c.counter += i
		c.notifyClients()
	}
}

func (c *Counter) AddClient(client *Client) {
	fmt.Println("New client")
	c.clients = append(c.clients, client)
}

func (c *Counter) RemoveClient(client *Client) {
	fmt.Println("Client disconnected")
	fmt.Println("Connected clients:", len(c.clients))
	var index int
	for i, c := range c.clients {
		if c == client {
			index = i
			break
		}
	}
	c.clients = append(c.clients[:index], c.clients[index+1:]...)
	client.Done <- true
}
