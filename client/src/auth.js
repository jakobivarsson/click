import Firebase from 'firebase'

const setUser = ({ user, password }) => {
  localStorage.setItem('user', user)
  localStorage.setItem('password', password)
}

export const login = (user, password) => {
  return Firebase.auth().signInWithEmailAndPassword(user, password)
    .then(result => setUser({user, password}))
}

export const logout = () => setUser({ user: '', password: '' })

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
