import ReconnectingWebSocket from 'reconnectingwebsocket';

let ws;

function url(username, password) {
  return `wss://click.armada.nu/ws?username=${username}&password=${password}`;
}

export function connect(success, error) {
  if (ws && ws.readyState === 1) {
    success(ws);
  } else {
    ws = new ReconnectingWebSocket(url(localStorage.username, localStorage.password));
    ws.onopen = () => success(ws);
  }
}
export function auth(username, password, success, error) {
  ws = new ReconnectingWebSocket(url(username, password));
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
