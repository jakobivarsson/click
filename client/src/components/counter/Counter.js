import React, { Component } from 'react';
import { connect } from '../../auth';
import { subscribe, click, UPDATE } from '../../messages';
import './Counter.css';

class Counter extends Component {
  constructor(props) {
	super(props);
	this.state = {
	  value: 0,
	  name: props.params.name
	}
	this.handleIncrement = this.handleIncrement.bind(this);
	this.handleDecrement = this.handleDecrement.bind(this);
  }
  componentDidMount() {
	connect(ws => {
	  ws.onmessage = event => {
		const message = JSON.parse(event.data);	
		if(message.type === UPDATE && message.counter === this.state.name) {
		  this.setState({value: message.value});
		}
	  }
	  ws.send(subscribe(this.state.name));
	  this.setState({ws: ws});
	});
  }
  handleIncrement() {
	this.state.ws.send(click(this.state.name, 1));
  }
  handleDecrement() {
	this.state.ws.send(click(this.state.name, -1));
  }
  render() {
    return (
	  <div className="counter-container">
		<div className="counter">
		  <h1>{this.state.name}</h1>
		  <h2 className="counter-value">{this.state.value}</h2>
		  <div className="buttons">
			<button className="counter-button" onClick={this.handleDecrement}>-</button>
			<button className="counter-button" onClick={this.handleIncrement}>+</button>
		  </div>
		</div>
	  </div>
    );
  }
}

export default Counter;
