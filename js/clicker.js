// HTML Elements
var header = document.getElementById("header");
var plusButton = document.getElementById("counter");
var minusButton = document.getElementById("downcounter");
var progress = document.getElementById("progress");

// Colors
var melon =  "#00d790";
var grape =  "#e73953";
var licorice = "#2d2d2c";
var white = "#fff";
var disabledColor = "#ccc";
var enabledColor = white;

var exampleSocket = new WebSocket("ws://echo.websocket.org");

exampleSocket.onmessage = function(msg) {
	var response = msg.data;
	header.innerHTML = response;
};

exampleSocket.onopen = function() {
	console.log("Socket open y'all")
	enableButtons([plusButton], [true]);
	if (count == 0)
		enableButtons([minusButton], [true]); // Disable the minus button
	else 
		enableButtons([minusButton], [true]);
};

var count = 0;
plusButton.onclick = function() {
	updateCounter(++count);
	console.log("hello");
};

minusButton.onclick = function() {
	updateCounter(--count);
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

	exampleSocket.send(val);
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