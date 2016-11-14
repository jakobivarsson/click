import React, { Component } from 'react';
import './buildings.css';


class Buildings extends Component {
  getBuildings(buildings) {
    return buildings.map(building =>
      <li key={building} className='building'>{building}</li>
    );
  }

  render() {
    const buildings = ['Nymble', 'KTHB', 'Nymble THS Café', 'KTH Entrance'];
    return (
      <div className='buildingsContainer'>
		<div className='buildings'>
		  <h1>Buildings</h1>
		  <ul>{this.getBuildings(buildings)}</ul>
		</div>
      </div>
    );
  }
}

export default Buildings;
