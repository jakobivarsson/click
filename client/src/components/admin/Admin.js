import React, { Component } from 'react'
import { Link } from 'react-router'
import BackImg from './../counter/navigate_before.svg'
import {
  database, saveBuilding, toList, deleteBuilding
} from './../../utils/firebase'
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
const DELETE_BUILDING_WARNING = 'Are you sure you wish to delete this building?'
  + ' This CANNOT be undone.'

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
    this.handleDeleteBuilding = this.handleDeleteBuilding.bind(this)
  }

  componentDidMount() {
    this.ref = database.ref('/buildings')
    this.ref.on('value', snapshot => {
      this.setState({ buildings: toList(snapshot.val()) })
    })
  }

  componentWillUnmount() {
    this.ref.off()
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

  handleDeleteBuilding(key) {
    if (confirm(DELETE_BUILDING_WARNING)) {
      deleteBuilding(key)
    }
  }

  renderBuilding({name, count, limit, key}) {
    const isOvercrowded = count > limit
    const overcrowdedClass = isOvercrowded ? 'overcrowded' : ''
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
        <button
          className='delete'
          onClick={() => this.handleDeleteBuilding(key)}>
          Delete
        </button>
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
      <div className="counter-container">
        <div>
          <Link to="/">
            <div className="counter-navigate">
                <img src={BackImg} width={30} height={29} alt="back" />
                <div>Buildings</div>
            </div>
          </Link>

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
      </div>
    );
  }
}

export default Admin
