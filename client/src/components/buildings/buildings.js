import React, { Component } from 'react';
import { Link } from 'react-router';
import './buildings.css';
import database from "../../utils/firebase";

class Buildings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buildings: [],
      fetching: false
    };
  }

  componentDidMount() {
    const self = this
    this.setState({fetching: true})
    database.ref('/buildings').on('value', snapshot => {
      self.mapToBuildings(snapshot)
    })
  }

  componentWillUnmount() {
    database.ref('/buildings').off()
  }

  getBuildings(buildings) {
    return buildings.map(building =>
      <li key={building.name} className='building'>
        <Link to={`/buildings/${building.name}`}>{building.name}</Link>
      </li>
    );
  }

  mapToBuildings(obj) {
    this.setState({buildings: obj.val().filter(building => building !== undefined).sort(), fetching: false})
  }

  render() {
    const buildings = this.state.buildings;
    let list;
    if (this.state.fetching) {
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
        <div className='statistics-link'>
          <Link to="/statistics">Statistics</Link>
        </div>
      </div>
    );
  }
}

export default Buildings;
