import React, { Component } from 'react';
import { connect } from '../../auth';
import { subscribe, unsubscribe, click, UPDATE } from '../../messages';
import BackImg from './navigate_before_white.svg';
import AddImg from './add_white.svg';
import RemoveImg from './remove_white.svg';
import { Link } from 'react-router';
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
          this.setState({
            value: message.value,
          });
        }
      }
      ws.send(subscribe(this.state.name));
      this.setState({ws: ws});
    });
    document.onkeydown = e => {
      if(e.keyCode === 39) {
        this.handleIncrement();
      } else if(e.keyCode === 37) {
        this.handleDecrement();
      }
    };
  }
  componentWillUnmount() {
    this.state.ws.send(unsubscribe(this.state.name));
    connect(ws => ws.onmessage = null);
    document.onkeydown = undefined;
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
        <Link to="/">
          <div className="counter-navigate">
              <img src={BackImg} width={30} height={29} alt="back" />
              <div>Buildings</div>
          </div>
        </Link>
        <div className="counter">
          <h1>{this.state.name}</h1>
          <h2 className="counter-value">{this.state.value}</h2>

          <div className="buttons">
            <button className="counter-button" onClick={this.handleDecrement}>
              <img src={RemoveImg} width={60} height={60} alt="decrement" />
            </button>
            <button className="counter-button" onClick={this.handleIncrement}>
              <img src={AddImg} width={60} height={60} alt="increment" />
            </button>
          </div>

        </div>
      </div>
    );
  }
}

export default Counter;
