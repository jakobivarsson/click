import React, { Component } from 'react';
import { Link } from 'react-router';
import './buildings.css';
import { database, toList } from "../../utils/firebase";

class Buildings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buildings: [],
      fetching: false
    };
  }

  componentDidMount() {
    this.setState({fetching: true})
    database.ref('/buildings').on('value', snapshot => {
      this.mapToBuildings(toList(snapshot.val()))
    })
  }

  componentWillUnmount() {
    database.ref('/buildings').off()
  }

  getBuildings(buildings) {
    return buildings.map(building =>
      <li key={building.key} className='building'>
        <Link to={`/buildings/${building.key}`}>{building.name}</Link>
      </li>
    );
  }

  mapToBuildings(buildings) {
    this.setState({
      buildings: buildings.filter(building => building !== undefined).sort(),
      fetching: false
    })
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
