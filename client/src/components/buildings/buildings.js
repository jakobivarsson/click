import React, { Component } from 'react';
import './buildings.css';


class Buildings extends Component {

  getBuildings() {
    const buildings = ['Nymble', 'KTHB', 'Nymble THS Café', 'KTH Entrance'];
    const buildingsList = buildings.map(building =>
      <li className='building'>{building}</li>
    );
    return buildingsList;
  }

  render() {
    return (
      <div className='buildings'>
        <ul>{this.getBuildings()}</ul>
      </div>
    );
  }
}

export default Buildings;
