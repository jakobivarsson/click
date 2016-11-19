import React, { Component } from 'react';
import TimeChart from './TimeChart';
import {connect} from '../../auth';
import {subscribeAll, unsubscribeAll} from '../../messages';
import 'whatwg-fetch';
import './Statistics.css';

// Seconds of day
const DAY = 24*60*60;
const MINUTE = 60000;

export default class Statistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counts: [],
      clicks: [],
      buildings: []
    };
    this.disableSeries = this.disableSeries.bind(this);
    this.totalClicks = this.totalClicks.bind(this);
    this.totalVisitors = this.totalVisitors.bind(this);
    this.renderVisitors = this.renderVisitors.bind(this);
    this.fetchStats = this.fetchStats.bind(this);
  }

  componentDidMount() {
    this.fetchStats();
    const interval = setInterval(() => this.fetchStats(), 5*MINUTE);
    this.setState({interval});
    connect(ws => {
      ws.onmessage = event => {
        const message = JSON.parse(event.data);
        let index = -1;
        const counter = {
          name: message.counter,
          value: message.value,
          clicks: message.clicks
        };
        const buildings = this.state.buildings;
        buildings.forEach((b, i) => {
          if(b.name===message.counter) {
            index = i;
          }
        });
        if(index > -1) {
          buildings[index] = counter;
        } else {
          buildings.push(counter);
        }
        this.setState({buildings});
      }
      ws.send(subscribeAll());
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
    connect(ws => ws.send(unsubscribeAll()));
  }

  fetchStats() {
    const user = localStorage.username;
    const pass = localStorage.password;
    const to = Math.round(Date.now()/1000); // convert to seconds #lerp
    const from = to-2*DAY;
		const url = `https://click.armada.nu/stats?username=${user}&password=${pass}&from=${from}&to=${to}`;
    fetch(url).then(r => r.json()).then(buildings => {
      const clicks = buildings.map(b => {
        const prev = this.state.clicks.find(s => s.title === b.name);
        return {
          title: b.name,
          disabled: prev ? prev.disabled : false,
          data: b.clicks.map(c => {
            return {
              x: c.time*1000,
              y: c.value
            };
          }).sort((a, b) => a.x-b.x)
        }
      });
      const counts = buildings.map(b => {
        const prev = this.state.counts.find(s => s.title === b.name);
        return {
          title: b.name,
          disabled: prev ? prev.disabled : false,
          data: b.counts.map(c => {
            return {
              x: c.time*1000,
              y: c.value
            };
          }).sort((a, b) => a.x-b.x)
        }
      });
      this.setState({clicks, counts});
    });
  }

  totalClicks() {
    const {buildings} = this.state;
    return buildings.reduce((sum, b) => sum+b.clicks, 0);
  }

  totalVisitors() {
    const {buildings} = this.state;
    return buildings.reduce((sum, b) => sum+b.value, 0);
  }

  renderVisitors() {
    const {buildings} = this.state;
    return buildings.map(building => 
      <div key={building.name}>{building.name}: {building.value}</div>
    );
  }

  disableSeries(index) {
    const {clicks, counts} = this.state;
    clicks[index].disabled = !clicks[index].disabled;
    counts[index].disabled = !counts[index].disabled;
    this.setState({counts, clicks});
  }

  render() {
    return (
      <div className='center'>
        <div className='statistics'>
          <h1>Building Statistics</h1>
          <h2>Real time</h2>
          <div className='statistics-numbers'>
            <div>Total: {this.totalVisitors()}</div>
            {this.renderVisitors()}
        </div>
        <h2>Visitors</h2>
        <TimeChart 
          series={this.state.counts}
          disableSeries={this.disableSeries}/>
        <h2>Clicks</h2>
        <div className='statistics-numbers'>
        <div>Total: {this.totalClicks()}</div>
        </div>
        <TimeChart 
          series={this.state.clicks}
          disableSeries={this.disableSeries}/>
      </div>
      </div>
    );
  }
}

