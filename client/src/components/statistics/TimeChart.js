import React, { Component } from 'react';
import {
	XYPlot,
	XAxis,
	YAxis,
	makeWidthFlexible,
	HorizontalGridLines,
	VerticalGridLines,
	LineSeries,
	Crosshair,
	DiscreteColorLegend} from 'react-vis';
import './TimeChart.css';

const FlexibleXYPlot = makeWidthFlexible(XYPlot);

export default class TimeChart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			crosshairValues: []
		};
		this.onNearestX = this.onNearestX.bind(this);
		this.onLegendClick = this.onLegendClick.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
		this.formatCrosshairItems = this.formatCrosshairItems.bind(this);
	}

	onNearestX(value, {index}) {
		this.setState({
			crosshairValues: this.props.series.map(s => s.data[index])
		});
	}

	onLegendClick(item, i) {
		this.props.disableSeries(i);
	}

	onMouseLeave() {
		this.setState({ crosshairValues: [] });
	}

	formatCrosshairTitle(values) {
		const time = new Date(values[0].x);
		// TODO format time
		return {
			title: 'Time',
			value: `${time.getHours()}:${time.getMinutes()}`
		};
	}

	formatCrosshairItems(values) {
		const {series} = this.props;
		// Filter disabled?
		return values.filter((v, i) => !series[i].disabled).map((v, i) => {
			return {
				title: series[i].title,
				value: v.y
			};
		});
	}

	renderSeries(series) {
		return series.map((s, i) =>
			<LineSeries 
				key={i}
				onNearestX={i === 0 ? this.onNearestX : null}
				{...{opacity: s.disabled ? 0.2 : 1}}
				data={s.data} />
		);
	}

	render() {
		const {crosshairValues} = this.state;
		const {series} = this.props;
		return (
			<div className="time-chart">
				<FlexibleXYPlot
					animation={true}
					xType="time"
					onMouseLeave={this.onMouseLeave}
					height={300}>
					<HorizontalGridLines />
					<VerticalGridLines />
					<XAxis title="Time" />
					<YAxis title="Value" />
					<Crosshair
						titleFormat={this.formatCrosshairTitle}
						itemsFormat={this.formatCrosshairItems}
						values={crosshairValues} />
					{ this.renderSeries(series) }
				</FlexibleXYPlot>
				<div>
					<DiscreteColorLegend
						onItemClick={this.onLegendClick}
						width={100}
						items={series} />
				</div>
			</div>
		);
	}
}
