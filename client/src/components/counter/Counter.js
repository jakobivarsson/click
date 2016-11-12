import React, { Component } from 'react';
import './Counter.css';

class Counter extends Component {
  render() {
    return (
      <div className="counter">
        <h1>Nymble</h1>
        <button className="counter-button">-</button>
        <button className="counter-button">+</button>
      </div>
    );
  }
}

export default Counter;
