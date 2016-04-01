package main

import (
	"fmt"
	"golang.org/x/net/websocket"
	"io"
	"strconv"
)

type Client struct {
	ws      *websocket.Conn
	Update  chan int
	Done    chan bool
	counter *Counter
}

func NewClient(ws *websocket.Conn, counter *Counter) *Client {
	update := make(chan int)
	done := make(chan bool)
	return &Client{ws, update, done, counter}
}

func (c *Client) Listen() {
	websocket.Message.Send(c.ws, strconv.Itoa(c.counter.counter))
	go c.write()
	c.read()
}

func (c *Client) read() {
	var data []byte
	for {
		err := websocket.Message.Receive(c.ws, &data)
		if err == io.EOF {
			c.counter.RemoveClient(c)
			return
		} else if err != nil {
			fmt.Println("Error:", err)
			continue
		}
		message := string(data)
		fmt.Println("New message:", message)
		switch {
		case message == "increment":
			c.counter.Update <- 1
		case message == "decrement":
			c.counter.Update <- -1
		}
	}
}

func (c *Client) write() {
	for {
		select {
		case message := <-c.Update:
			fmt.Println("Sending message:", message)
			if err := websocket.Message.Send(c.ws, strconv.Itoa(message)); err != nil {
				fmt.Println("Error sending message:", err)
				continue
			}
		case <-c.Done:
			fmt.Println("work done!")
			return
		}
	}
}
