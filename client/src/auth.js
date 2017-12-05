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
export const auth = (username, password) =>
  new Promise((resolve, reject) => {
    ws = new ReconnectingWebSocket(url(username, password));
    ws.onopen = () => {
      localStorage.username = username;
      localStorage.password = password;
      resolve(ws);
    };
    ws.onerror = () => {
      reject('Error opening websocket');
    }
  })


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
