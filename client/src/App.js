import React, { Component } from 'react';
import './App.css';
import Counter from './components/counter/Counter';
import Counters from './components/buildings/buildings';
import Login from './components/login/Login';
import { Router, Route, browserHistory } from 'react-router';

class App extends Component {
  constructor(props) {
	super(props);
	this.auth = this.auth.bind(this);
	this.requireAuth = this.requireAuth.bind(this);
	this.loggedIn = this.loggedIn.bind(this);
	const username = localStorage.username;
	const password = localStorage.password;
	this.state = {
	  username: username,
	  password: password,
	  ws: null
	};
	if(this.loggedIn()) {
	  this.auth(username, password);
	}
  }

  auth(username, password, callback) {
	const ws = new WebSocket(`ws://localhost:3001/?username=${username}&password=${password}`);
	ws.onopen = () => {
	  localStorage.username = username;
	  localStorage.password = password;
	  this.setState({
		ws: ws,
		username: username,
		password: password
	  });
	  if(callback) {
		callback();
	  }
	};
  }

  loggedIn() {
	return !!this.state.username && !!this.state.password;
  }

  requireAuth(nextState, replace) {
	if(!this.loggedIn()) {
	  replace({
		pathname: '/login',
		state: { nextPathname: nextState.location.pathname }
	  });
	}
  }
  
  render() {
	const ws = this.state.ws;
    return (
	  <Router history={browserHistory}>
		<Route path="/" component={() => <Counters ws={ws} />} onEnter={this.requireAuth} />
		<Route path="/counter" component={() => <Counter ws={ws} />} onEnter={this.requireAuth}/>
		<Route path="/login" component={() => <Login auth={this.auth} />} />
	  </Router>
    );
  }
}

export default App;
