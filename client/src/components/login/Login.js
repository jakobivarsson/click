import React, { Component } from 'react';
import './Login.css';

class Login extends Component {
  constructor() {
    super();
    
    this.positionCircle = function(v) {
      const circle = document.getElementById('circle');
			circle.setAttribute('cx', v.clientX);
			circle.setAttribute('cy', v.clientY);
      const login = document.getElementById('login-rect');
			login.setAttribute('class', 'login-progress');
      setTimeout(() => {
        login.setAttribute('display', 'none');
        circle.setAttribute('class', 'expand');
      }, 2400);
    }
  }
  render() {
    return (
      <div className="login">
        <div>
          <h1>click</h1>
          <input placeholder="User"></input>
          <input placeholder="Pass" type="password"></input>
          <div className="button-container" onClick={this.positionCircle}>
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
