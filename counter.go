package main

import (
	"fmt"
)

type Counter struct {
	clients    []*Client
	Update     chan int
	Register   chan *Client
	Unregister chan *Client
	counter    int
}

func NewCounter() *Counter {
	update := make(chan int, 8)
	register := make(chan *Client, 4)
	unregister := make(chan *Client, 4)
	return &Counter{Update: update, Register: register, Unregister: unregister}
}

func (c *Counter) notifyClients() {
	for _, client := range c.clients {
		client.Update <- c.counter
	}
}

func (c *Counter) Start() {
	for {
		select {
		case i := <-c.Update:
			c.updateValue(i)
		case client := <-c.Register:
			c.addClient(client)
		case client := <-c.Unregister:
			c.removeClient(client)
		}
	}
}

// The following methods are not thread-safe and should only be called by the owning Counter.

func (c *Counter) updateValue(i int) {
	if c.counter+i < 0 {
		return
	}
	c.counter += i
	c.notifyClients()
}

func (c *Counter) addClient(client *Client) {
	fmt.Println("New client")
	c.clients = append(c.clients, client)
}

func (c *Counter) removeClient(client *Client) {
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
