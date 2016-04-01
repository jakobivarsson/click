// HTML Elements
var header = document.getElementById("header");
var plusButton = document.getElementById("counter");
var minusButton = document.getElementById("downcounter");
var progress = document.getElementById("progress");
var building = document.getElementById("building")

// Colors
var melon =  "#00d790";
var grape =  "#e73953";
var licorice = "#2d2d2c";
var white = "#fff";
var lightGray = "#efefef"
var disabledColor = "#ccc";
var enabledColor = lightGray;

var counters = []

var ip = "130.229.149.207:8000"
var socket;
var countersPath = "http://" + ip + "/counters"

var getCounters = new XMLHttpRequest();
getCounters.open('GET', countersPath, true);

getCounters.onload = function() {
  if (getCounters.status >= 200 && getCounters.status < 400) {
    counters = JSON.parse(getCounters.responseText);
    setBuilding(counters[1]);
  } else {
    console.log("error fetching counters")
  }
};

getCounters.send();

function setBuilding(counterName) {
	building.innerHTML = counterName

	socket = new WebSocket("ws://" + ip + "/counters/" + counterName);

	socket.onmessage = function(msg) {
		var response = msg.data;
		updateCounter(response);
		header.innerHTML = response;
	};

	socket.onopen = function(e) {
		console.log("Socket open y'all");
		enableButtons([plusButton], [true]);
		if (count == 0)
			enableButtons([minusButton], [true]); // Disable the minus button
		else 
			enableButtons([minusButton], [true]);
	};
}

var count = 0;
plusButton.onclick = function() {
	updateCounter(++count);
	socket.send("increment");
};

minusButton.onclick = function() {
	updateCounter(--count);
	socket.send("decrement");
};

function updateCounter(val) {
	if (val == 0) {
		minusButton.disabled = true
		minusButton.style.color = disabledColor;	
	}
	else {
		minusButton.disabled = false
		minusButton.style.color = white;
	}

	socket.send(val);
}


function enableButtons(buttonsArray, enabledArray) {
	for (var i = 0; i < buttonsArray.length; i++) {
		buttonsArray[i].enabled = enabledArray[i];
		if (enabledArray[i])
			buttonsArray[i].style.color = enabledColor
		else 
			buttonsArray[i].style.color = disabledColor;
	}
}


// Disable the buttons (reenable once socket has connected)
enableButtons([minusButton, plusButton], [false, false]);

// Listen to right and left buttons
document.onkeydown = function(e) {
    if (e.keyCode === 39) {
    	if (plusButton.enabled)
    		plusButton.click();
    } else if (e.keyCode === 37) {
    	if (minusButton.enabled)
    		minusButton.click();
    }
};