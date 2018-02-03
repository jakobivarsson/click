import ReconnectingWebSocket from 'reconnectingwebsocket';
import Firebase from 'firebase'

let ws;

function url(username, password) {
  return `wss://click.armada.nu/ws?username=${username}&password=${password}`;
}

const setUser = ({ user, token }) => {
  localStorage.setItem('user', user)
  localStorage.setItem('token', token)
}

export const login = () => {
  const provider = new Firebase.auth.GoogleAuthProvider()
  return Firebase.auth().signInWithPopup(provider)
    .then(result => {
      const user = result.user
      const token = result.credential.accessToken
      setUser({user, token})
    })
}

export const logout = () => setUser({ user: '', token: '' })

export function connect(success, error) {
  if (ws && ws.readyState === 1) {
    success(ws);
  } else {
    ws = new ReconnectingWebSocket(url(localStorage.username, localStorage.password));
    ws.onopen = () => success(ws);
  }
}

export function loggedIn() {
  return !!(localStorage.user !== '' && localStorage.token !== '')
}

export function requireAuth(nextState, replace) {
  if (!loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    });
  }
}
