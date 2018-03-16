// @flow weak

/* eslint no-console:0 */
import React, { Component } from 'react'
import PropTypes      from 'prop-types'
import Moment                    from 'react-moment'

import { AnimatedView } from '../../components'

import { fetchCronInfo } from '../../redux/modules/cycles'
import { store } from '../../Root'

import Cycles from '../../components/cycles/Cycles'
import Rounds from '../../components/rounds/Rounds'

class CyclesView extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      enterCyclesView: PropTypes.func,
      leaveCyclesView: PropTypes.func
    })
  }

  constructor(props){
    super(props)
  }

  componentWillReceiveProps(nextProps, nextState){
    this.props = nextProps
  }

  shouldComponentUpdate(){
    return true
  }

  componentDidMount() {
    store.dispatch(fetchCronInfo())
  }

  componentWillMount() {
    const { actions: { enterCyclesView } } = this.props
    enterCyclesView()
  }

  componentWillUnmount() {
    const { actions: { leaveCyclesView } } = this.props
    leaveCyclesView()
  }

  render() {
    const { cycles } = this.props
    const { cronInfo } = this.props.cycles
    let crondate = new Date(cronInfo)

    console.log('rendering cycles and rounds',this.props)
    return (
      <AnimatedView>
        <div className="simpleContainer">
          <h2 className="gridH2">
            Cycles -- Last cron run: 
            <span className="text-red"><Moment date={crondate} /></span>
            <button className="pull-right" bsStyle="primary" onClick={this.handlePulseCron} >
              pulse cron
            </button>
          </h2>
          <Cycles { ...{ store } } />

          <h2 className="gridH2">
            Rounds
          </h2>
          <Rounds { ...{ store } } />

        </div>
      </AnimatedView>
    )
  }

  handlePulseCron = ( event: SyntheticEvent<> ) => {
    if (event) event.preventDefault()

    console.log('pulse cron, props',this.props)
    const { actions: { pulseCron } } = this.props
    pulseCron()
  }
}

export default CyclesView