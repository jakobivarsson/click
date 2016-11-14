package click

import (
	"encoding/json"
	"fmt"
	"golang.org/x/net/websocket"
	"io"
)

type Publisher interface {
	Subscribe(Subscriber)
	Unsubscribe(Subscriber)
	Publish(Message)
}

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
			message = Message{Type: TypeUnsubscribe, Subscriber: c}
			c.server.Message <- message
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
		fmt.Println("New message:", message)
		message.Subscriber = c
		c.server.Message <- message
	}
}

func (c *Client) write() {
	for {
		message, more := <-c.Update
		if more {
			fmt.Println("Sending message:", message)
			data, err := json.Marshal(message)
			if err = websocket.Message.Send(c.ws, data); err != nil {
				fmt.Println("Error sending message:", err)
				continue
			}
		} else {
			return
		}
	}
}
