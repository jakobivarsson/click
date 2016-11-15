let ws;

function url(username, password) {
  return `ws://localhost:3001/?username=${username}&password=${password}`;
}

export function connect(success, error) {
  if(ws && ws.readyState === 1) {
	success(ws);
  } else {
	ws = new WebSocket(url(localStorage.username, localStorage.password));
	ws.onopen = () => {
	  console.log("websocket open")
	  success(ws);
	}
	ws.onerror = () => {
	  console.log("websocket error");
	  error();
	}
	ws.onclose = () => {
	  console.log("websocket closed");
	}
  }
}
export function auth(username, password, success, error) {
  ws = new WebSocket(url(username, password));
  ws.onopen = () => {
	localStorage.username = username;
	localStorage.password = password;
	success(ws);
  };
  ws.onerror = () => {
	error();
  }
}

export function loggedIn() {
  return !!localStorage.username && !!localStorage.password;
}

export function requireAuth(nextState, replace) {
  if(!loggedIn()) {
	replace({
	  pathname: '/login',
	  state: { nextPathname: nextState.location.pathname }
	});
  }
}
