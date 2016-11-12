package click

const (
	TypeClick         = "click"
	TypeCounterUpdate = "counter_update"
	TypeSubscribe     = "subscribe"
	TypeUnsubscribe   = "unsubscribe"
	TypeGetCounters   = "get_counters"
	TypeCounters      = "counters"
)

type Message struct {
	Type       string `json: type`
	Counter    string `json: counter`
	Value      int    `json: value`
	Subscriber Subscriber
	Counters   []string `json: counters,omitempty`
}
