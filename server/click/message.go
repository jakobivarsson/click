package main

const (
	TypeClick          = "click"
	TypeCounterUpdate  = "counter_update"
	TypeSubscribeAll   = "subscribe_all"
	TypeSubscribe      = "subscribe"
	TypeUnsubscribe    = "unsubscribe"
	TypeUnsubscribeAll = "unsubscribe_all"
	TypeGetCounters    = "get_counters"
	TypeCounters       = "counters"
)

type Message struct {
	Type       string     `json:"type"`
	Counter    string     `json:"counter,omitempty"`
	Value      int        `json:"value"`
	Clicks     int        `json:"clicks"`
	Subscriber Subscriber `json:"-"`
	Counters   []string   `json:"counters,omitempty"`
}
