import React, { Component } from 'react';
import './buildings.css';
import { getCounters, COUNTERS } from '../../messages';
import { connect } from '../../auth';
import { Link } from 'react-router';


class Buildings extends Component {
  constructor(props) {
	super(props);
	this.state = {
	  buildings: [],
	  fetching: false
	};
	this.fetchBuildings = this.fetchBuildings.bind(this);
  }

  fetchBuildings() {
	connect(ws => {
	  ws.onmessage = event => {
		const message = JSON.parse(event.data)
		if(message.type === COUNTERS) {
		  this.setState({
			buildings: message.counters.sort(),
			fetching: false
		  });
		}
	  }
	  ws.send(getCounters());	
	  this.setState({fetching: true});
	});
  }

  componentDidMount() {
	this.fetchBuildings();
  }

  getBuildings(buildings) {
    return buildings.map(building =>
      <li key={building} className='building'>
		<Link to={`/buildings/${building}`}>{building}</Link>
	  </li>
    );
  }

  render() {
	const buildings = this.state.buildings;
	let list;
	if(this.state.fetching) {
	  list = <div className='loader buildings-loader' />;
	} else {
	  list = <ul>{this.getBuildings(buildings)}</ul>
	}
    return (
      <div className='buildings-container'>
		<div className='buildings'>
		  <h1>Buildings</h1>
		  {list}
		</div>
      </div>
    );
  }
}

export default Buildings;
