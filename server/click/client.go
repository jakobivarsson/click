package main

import (
	"encoding/json"
	"fmt"
	"io"

	"golang.org/x/net/websocket"
)

type Client struct {
	ws     *websocket.Conn
	Update chan Message
	server *Server
}

// Creates a new client
func NewClient(ws *websocket.Conn, server *Server) *Client {
	update := make(chan Message)
	return &Client{ws, update, server}
}

func (c *Client) Notify(m Message) {
	c.Update <- m
}

// Registers the client to its counter
// and listens for updates from ws and counter
func (c *Client) Listen() {
	go c.write()
	c.read()
}

func (c *Client) read() {
	var data []byte
	for {
		err := websocket.Message.Receive(c.ws, &data)
		var message Message
		if err == io.EOF {
			message = Message{Type: TypeUnsubscribeAll, Subscriber: c}
			c.server.Message <- message
			close(c.Update)
			return
		} else if err != nil {
			fmt.Println("Error:", err)
			continue
		} else {
			if err = json.Unmarshal(data, &message); err != nil {
				fmt.Println("Error:", err)
				continue
			}
		}
		message.Subscriber = c
		c.server.Message <- message
	}
}

func (c *Client) write() {
	for {
		message, more := <-c.Update
		if more {
			data, err := json.Marshal(message)
			if err = websocket.Message.Send(c.ws, string(data)); err != nil {
				fmt.Println("Error sending message:", err)
			}
		} else {
			return
		}
	}
}
