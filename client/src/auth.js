let ws;
let reconnect;

function url(username, password) {
  return `wss://click.armada.nu/ws?username=${username}&password=${password}`;
}

export function connect(success, error) {
  if (ws && ws.readyState === 1) {
    success(ws);
  } else {
    ws = new WebSocket(url(localStorage.username, localStorage.password));
    ws.onopen = () => {
      console.log("websocket open");
      if(reconnect) {
        clearInterval(reconnect);
        reconnect = null;
      }
      success(ws);
    }
    ws.onerror = () => {
      console.log("websocket error");
      if(error) {
        error();
      }
    }
    ws.onclose = () => {
      ws = null;
      console.log("websocket closed");
      reconnect = setInterval(() => {
        console.log("trying to reconnect");
        connect(success, error);
      }, 5000);
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
