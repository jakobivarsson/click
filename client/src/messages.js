export const GETCOUNTERS = "get_counters";
export const COUNTERS = "counters";
export const CLICK = "click";
export const UPDATE = "counter_update";
export const SUBSCRIBE_ALL = "subscribe_all";
export const SUBSCRIBE = "subscribe";
export const UNSUBSCRIBE = "unsubscribe";

export function getCounters() {
    return JSON.stringify({
        type: GETCOUNTERS
    });
}

export function click(counter, value) {
    return JSON.stringify({
        type: CLICK,
		counter,
        value
    });
}

export function subscribeAll() {
	return JSON.stringify({
		type: SUBSCRIBE_ALL
	});
}

export function subscribe(counter) {
	return JSON.stringify({
		type: SUBSCRIBE,
		counter
	});
}

export function unsubscribe(counter) {
	return JSON.stringify({
		type: UNSUBSCRIBE,
		counter
	});
}
