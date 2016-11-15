import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { auth } from '../../auth';
import './Login.css';

class Login extends Component {
  constructor(props) {
    super(props);
	
	this.handleUserChange = this.handleUserChange.bind(this);
	this.handlePassChange = this.handlePassChange.bind(this);
	this.handleSubmit = this.handleSubmit.bind(this);
	
	this.state = {
	  username: '',
	  password: ''
	}
  }
  
  handleUserChange(event) {
	this.setState({username: event.target.value});
  }

  handlePassChange(event) {
	this.setState({password: event.target.value});
  }

  handleSubmit(event) {
	this.positionCircle(event);
	const username = this.state.username;
	const password = this.state.password;
	auth(username, password, () => {
	  browserHistory.push('/');
	}, () => {
	  console.log("Error opening websocket");
	});
  }
    
  positionCircle(event) {
	const circle = document.getElementById('circle');
		  circle.setAttribute('cx', event.clientX);
		  circle.setAttribute('cy', event.clientY);
	const login = document.getElementById('login-rect');
		  login.setAttribute('class', 'login-progress');
	setTimeout(() => {
	  login.setAttribute('display', 'none');
	  circle.setAttribute('class', 'expand');
	}, 2400);
  }

  render() {
    return (
      <div className="login">
        <div>
          <h1>click</h1>
          <input placeholder="User" value={this.state.username} onChange={this.handleUserChange} />
          <input placeholder="Pass" value={this.state.password} onChange={this.handlePassChange} type="password" />
          <div className="button-container" onClick={this.handleSubmit}>
            <button>Login</button>

            <svg id="login-svg" className="login-button">
              <rect id="login-rect" />
            </svg>

          </div>
        </div>
        <svg id="circle-container">
          <circle id="circle" cx="10" cy="10" r="0"/>
        </svg>
      </div>
    );
  }
}

export default Login;
