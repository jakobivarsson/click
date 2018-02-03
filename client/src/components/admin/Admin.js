import React, { Component } from 'react'
import { database, saveBuilding, toList } from './../../utils/firebase'
import Indicator from './../indicators/Indicator'
import './Admin.css'

const DEFAULT_NEW_BUILDING = {
  name: '',
  count: 0,
  limit: undefined,
}
const NO_NAME_ERROR = 'Enter a name for your building.'
const NO_MAX_COUNT_ERROR = 'Specify how many people are' +
  'allowed in your building.'

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buildings: [],
      newBuilding: DEFAULT_NEW_BUILDING,
      addingBuilding: false,
    }
    this.startAddingBuilding = this.startAddingBuilding.bind(this)
    this.updateNewBuilding = this.updateNewBuilding.bind(this)
    this.addBuilding = this.addBuilding.bind(this)
    this.cancelBuilding = this.cancelBuilding.bind(this)
    this.renderBuilding = this.renderBuilding.bind(this)
  }

  componentDidMount() {
    database.ref('/buildings').on('value', snapshot =>{
      this.setState({ buildings: toList(snapshot.val()) })
    }
    )
  }

  componentWillUnmount() {
    database.ref('/buildings').off()
  }

  startAddingBuilding() {
    this.setState({
      addingBuilding: true,
      newBuilding: DEFAULT_NEW_BUILDING
    })
  }

  updateNewBuilding(e) {
    this.setState({
      newBuilding: {
        ...this.state.newBuilding,
        [e.target.name]: e.target.value
      }
    })
  }

  cancelBuilding() {
    this.setState({
      addingBuilding: false,
      newBuilding: DEFAULT_NEW_BUILDING
    })
  }

  addBuilding() {
    const newBuilding = this.state.newBuilding;
    const { name, limit } = newBuilding;
    if (name && name !== '' && limit && limit > 0) {
      saveBuilding(newBuilding)
      this.setState({
        addingBuilding: false,
        newBuilding: DEFAULT_NEW_BUILDING,
      })
    } else {
      if (!name || name === '') alert(NO_NAME_ERROR)
      if (!limit || limit <= 0) alert(NO_MAX_COUNT_ERROR)
    }
  }

  renderBuilding({name, count, limit}) {
    const isOvercrowded = count > limit
    const overcrowdedClass = isOvercrowded ? 'admin-overcrowded' : ''
    return (
      <div key={name}
        className='admin-building'>
        <span
          className={'admin-building-header'}>
          {name}
        </span>
        <span
          className={'admin-building-count ' + overcrowdedClass}>
          ({count}/{limit} people) { isOvercrowded && 'WARNING: OVERCROWDED' }
        </span>
      </div>
    )
  }

  render() {
    const {
      buildings,
      addingBuilding,
      newBuilding,
    } = this.state;
    return (
      <div className="admin-container">
        <div>
          <h1>Buildings</h1>
          { buildings.length === 0
            ? <Indicator/>
            : buildings.map(this.renderBuilding)
          }
          { addingBuilding
            ? (
              <div>
                <input type='text'
                  onChange={this.updateNewBuilding}
                  onKeyPress={e => e.key === 'Enter'
                    && this.addBuilding()}
                  name="name"
                  value={newBuilding.name}
                  placeholder="Building Name"/>
                <input type='number'
                  onChange={this.updateNewBuilding}
                  min='1'
                  max='1000000000'
                  onKeyPress={e => e.key === 'Enter'
                    && this.addBuilding()}
                  name="limit"
                  value={newBuilding.limit}
                  placeholder="Max # of people"/>
                <button
                  style={{paddingRight: 10}}
                  onClick={this.addBuilding}>
                  Save 
                </button>
                <button
                  onClick={this.cancelBuilding}>
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={this.startAddingBuilding}>
                Add building
              </button>
            )
          }
        </div>
        <div>
        
        </div>
      </div>
    );
  }
}

export default Admin
