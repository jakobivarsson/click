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
      loading: false,
      loginFailed: false,
    }
  }

  componentDidMount() {
    if (loggedIn()) {
      browserHistory.push('/')
    }
  }

  handleLogin() {
    login()
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

  render() {
    const { handleLogin } = this
    const {
      loading,
      loginFailed,
    } = this.state
    return (
      <div className="login">
        <div className="card">
          <h1>click</h1>

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
