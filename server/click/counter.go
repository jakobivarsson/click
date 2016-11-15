package click

import (
	"fmt"
)

type Subscriber interface {
	Notify(Message)
}

type Counter struct {
	name        string
	subscribers []Subscriber
	Update      chan Message
	Subscribe   chan Subscriber
	Unsubscribe chan Subscriber
	count       int
}

func NewCounter(name string, count int) *Counter {
	update := make(chan Message, 8)
	subscribe := make(chan Subscriber, 4)
	unsubscribe := make(chan Subscriber, 4)
	return &Counter{name: name, Update: update, Subscribe: subscribe, Unsubscribe: unsubscribe, count: count}
}

func (c *Counter) notifyClients() {
	for _, client := range c.subscribers {
		client.Notify(Message{Type: TypeCounterUpdate, Counter: c.name, Value: c.count})
	}
}

func (c *Counter) Start() {
	for {
		select {
		case m := <-c.Update:
			c.updateValue(m.Value)
		case client := <-c.Subscribe:
			c.addSubscriber(client)
		case client := <-c.Unsubscribe:
			c.removeSubscriber(client)
		}
	}
}

// The following methods are not thread-safe and should only be called by the owning Counter.

func (c *Counter) updateValue(i int) {
	if c.count+i < 0 {
		return
	}
	c.count += i
	c.notifyClients()
}

func (c *Counter) addSubscriber(subscriber Subscriber) {
	fmt.Println("New subscriber")
	c.subscribers = append(c.subscribers, subscriber)
	subscriber.Notify(Message{Type: TypeCounterUpdate, Counter: c.name, Value: c.count})
}

func (c *Counter) removeSubscriber(subscriber Subscriber) {
	index := -1
	for i, s := range c.subscribers {
		if s == subscriber {
			index = i
			break
		}
	}
	if index > -1 {
		fmt.Println("Client disconnected")
		c.subscribers = append(c.subscribers[:index], c.subscribers[index+1:]...)
		subscriber.Notify(Message{Type: TypeClose})
	}
	// close(client.Update)
}
