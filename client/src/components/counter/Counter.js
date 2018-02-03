import React, { Component } from 'react'
import BackImg from './navigate_before.svg'
import AddImg from './add.svg'
import RemoveImg from './remove.svg'
import { Link } from 'react-router'
import './Counter.css'
import { database, decrement, increment } from "../../utils/firebase"
import Indicator from './../indicators/Indicator'

class Counter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      building: {
        name: null,
        count: null,
        limit: null,
      },
      loading: true,
    }
    this.handleIncrement = this.handleIncrement.bind(this)
    this.handleDecrement = this.handleDecrement.bind(this)
  }
  componentDidMount() {
    const name = this.props.params.name
    this.ref = database.ref('/buildings/' + name)
    this.ref.on('value', snapshot =>
      this.setState({
        building: snapshot.val(),
        loading: false,
      })
    )
    document.onkeydown = e => {
      if(e.keyCode === 39) {
        this.handleIncrement()
      } else if(e.keyCode === 37) {
        this.handleDecrement()
      }
    }
  }

  componentWillUnmount() {
    this.ref.off()
    document.onkeydown = undefined
  }

  handleIncrement() {
    increment(this.ref)
  }

  handleDecrement() {
    decrement(this.ref)
  }

  render() {
    const {
      building: { name, count, limit },
      loading,
    } = this.state
    const isOvercrowded = count > limit
    return (
      <div className="counter-container">
        <Link to="/">
          <div className="counter-navigate">
              <img src={BackImg} width={30} height={29} alt="back" />
              <div>Buildings</div>
          </div>
        </Link>
        { loading
          ? <Indicator/>
          : <div className='counter'>
            <h1>{name}</h1>
            <h2 className={'counter-value ' + (isOvercrowded && 'overcrowded')}>
              {count}/{limit}
            </h2>
            { isOvercrowded && 
              <p className='overcrowded' style={{padding: '5px'}}>
                Warning: This building is overcrowded
              </p>
            }

            <div className="buttons">
              <button className="counter-button" onClick={this.handleDecrement}>
                <img src={RemoveImg} width={60} height={60} alt="decrement" />
              </button>
              <button className="counter-button" onClick={this.handleIncrement}>
                <img src={AddImg} width={60} height={60} alt="increment" />
              </button>
            </div>

          </div>
        }
      </div>
    )
  }
}

export default Counter
