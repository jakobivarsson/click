package main

const (
	TypeClick         = "click"
	TypeCounterUpdate = "counter_update"
	TypeSubscribe     = "subscribe"
	TypeUnsubscribe   = "unsubscribe"
	TypeGetCounters   = "get_counters"
	TypeCounters      = "counters"
	TypeClose         = "close"
)

type Message struct {
	Type       string     `json:"type"`
	Counter    string     `json:"counter,omitempty"`
	Value      int        `json:"value,omitempty"`
	Subscriber Subscriber `json:"-"`
	Counters   []string   `json:"counters,omitempty"`
}
