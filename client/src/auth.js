import Firebase from 'firebase'

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

export function loggedIn() {
  return !!localStorage.user && !!localStorage.token
}

export function requireAuth(nextState, replace) {
  if (!loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    });
  }
}
