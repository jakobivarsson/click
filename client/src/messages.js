export const GETCOUNTERS = "get_counters";
export const CLICK = "click";

export function getCounters() {
    return {
        type: GETCOUNTERS
    };
}

export function click(value) {
    return {
        type: CLICK,
        value: value
    };
}
