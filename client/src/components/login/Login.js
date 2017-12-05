import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { auth } from '../../auth'
import Indicator from './../indicators/Indicator'
import './Login.css'

class Login extends Component {
  constructor(props) {
    super(props)

    this.handleUserChange = this.handleUserChange.bind(this)
    this.handlePassChange = this.handlePassChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
      username: '',
      password: '',
      loginFailed: false,
      loading: false,
    }
  }

  handleUserChange(event) {
    this.setState({
      username: event.target.value,
      loginFailed: false,
    })
  }

  handlePassChange(event) {
    this.setState({
      password: event.target.value,
      loginFailed: false,
    })
  }

  handleSubmit() {
    const username = this.state.username
    const password = this.state.password
    this.setState({loading: true})
    auth(username, password)
      .then(() => {
        browserHistory.push('/')
        this.setState({loading: false})
      })
      .catch(e => {
        console.log(e)
        this.setState({loginFailed: true})
        this.setState({loading: false})
      })
  }

  render() {
    const { handleSubmit } = this
    const {
      loginFailed,
      username,
      loading,
    } = this.state
    return (
      <div className="login">
          <div className={
            "card " +
            (loginFailed && "error-background")
          }>
            <h1>click</h1>
            <input
              placeholder="User"
              value={this.state.username}
              onChange={this.handleUserChange}
              onKeyPress={e => e.key === 'Enter' && handleSubmit()}
            />
            <input
              placeholder="Pass"
              value={this.state.password}
              onChange={this.handlePassChange}
              type="password"
              onKeyPress={e => e.key === 'Enter' && handleSubmit()}
            />

            <div className="button-container" onClick={this.handleSubmit}>
              { loading ?
                <Indicator/> :

                <button
                  disabled={username.length > 0}
                  className={
                    loginFailed ? "failure" : "" +
                    username.length > 0 ? "active" : ""
                  }>
                  Login
                </button>
              }
            </div>
          </div>
        </div>
    )
  }
}

export default Login
