import React, { Component } from 'react';
import TimeChart from './TimeChart';
import './Statistics.css';

export default class Statistics extends Component {
	constructor(props) {
		super(props);
		const time = Date.now();
		const hour = 3600000;
		const data = [
			{x: time, y: 1},
			{x: time+hour, y: 2},
			{x: time+2*hour, y: 5},
			{x: time+3*hour, y: 2},
			{x: time+4*hour, y: 7}
		];
		const series = [{
			title: 'Nymble',
			disabled: false,
			data
		}];
		this.state = {
			series,
			buildings: [{
				name: "Nymble",
				value: 1000,
				clicks: 3000
			}, {
				name: "KTHB",
				value: 300,
				clicks: 2000
			}, {
				name: "KTH Entré",
				value: 100,
				clicks: 500
			}]
		};
		this.disableSeries = this.disableSeries.bind(this);
		this.totalClicks = this.totalClicks.bind(this);
		this.totalVisitors = this.totalVisitors.bind(this);
		this.renderVisitors = this.renderVisitors.bind(this);
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
			<div>{building.name}: {building.value}</div>
		);
	}

	disableSeries(index) {
		const {series} = this.state;
		series[index].disabled = !series[index].disabled;
		this.setState({series});
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
						series={this.state.series}
						disableSeries={this.disableSeries}/>
					<h2>Clicks</h2>
					<div className='statistics-numbers'>
						<div>Total: {this.totalClicks()}</div>
					</div>
					<TimeChart 
						series={this.state.series}
						disableSeries={this.disableSeries}/>
				</div>
			</div>
		);
	}
}

