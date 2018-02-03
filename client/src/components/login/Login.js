import React, { Component } from 'react'
import Indicator from './../indicators/Indicator'
import { browserHistory } from 'react-router';
import { login, loggedIn } from './../../auth'
import './Login.css'

class Login extends Component {
  constructor(props) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)

    this.state = {
      username: '',
      password: '',
      loading: false,
      loginFailed: false,
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    if (loggedIn()) {
      browserHistory.push('/')
    }
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleLogin() {
    const { username, password } = this.state
    if (username !== '' && password !== '') {
      login(username, password)
        .then(() => {
          this.setState({ loading: false })
          browserHistory.push('/')
        })
        .catch(error => {
          this.setState({
            loading: false,
            loginFailed: true,
          })
          console.error(error)
        })
    }
  }

  render() {
    const { handleLogin } = this
    const {
      loading,
      loginFailed,
      username,
      password,
    } = this.state
    return (
      <div className="login">
        <div className="card">
          <h1>click</h1>

          <input
            type='text'
            placeholder='username'
            name='username'
            onKeyPress={e => e.key === 'Enter' && this.handleLogin()}
            onChange={this.handleChange}
            value={username}/>
          <input
            type='password'
            placeholder='password'
            name='password'
            onKeyPress={e => e.key === 'Enter' && this.handleLogin()}
            onChange={this.handleChange}
            value={password}/>

          <div className="button-container" onClick={handleLogin}>
            { loading ?
              <Indicator/> :
              <button
                className={
                  loginFailed ? "failure" : ""
                }>
                Login
              </button>
            }
          </div>
          { loginFailed &&
              <div>Login Failed, try again later</div>
          }
        </div>
      </div>
    )
  }
}

export default Login
