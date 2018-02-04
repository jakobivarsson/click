import Firebase from 'firebase'

const setUser = ({ user, password }) => {
  localStorage.setItem('user', user)
  localStorage.setItem('password', password)
}

export const login = (user, password) => {
  return Firebase.auth().signInWithEmailAndPassword(user, password)
    .then(() => setUser({user, password}))
}

export const signOut = () => {
  Firebase.auth().signOut().catch(console.log)
  localStorage.clear()
}

export function loggedIn() {
  return !!localStorage.user && !!localStorage.password
}

export function requireAuth(nextState, replace) {
  if (!loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    });
  }
}

export const isAdmin = () =>
  loggedIn() && localStorage.user === 'lava-admin@click.com'

export const requireAdmin = (nextState, replace) => {
  if (!isAdmin()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    });
  }
}
