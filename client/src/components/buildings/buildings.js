import React, { Component } from 'react';
import './buildings.css';


class Buildings extends Component {
  constructor(props) {
	super(props);
	this.state = {
	  buildings: []
	};
  }
  getBuildings(buildings) {
    return buildings.map(building =>
      <li key={building} className='building'>{building}</li>
    );
  }

  render() {
	const buildings = this.state.buildings;
	let list;
	if(buildings.length === 0) {
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
