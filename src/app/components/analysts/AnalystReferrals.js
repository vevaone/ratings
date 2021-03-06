import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Moment from 'react-moment'
import { Panel } from 'react-bootstrap'
import referralCode from '../../services/referralCode'
import { userActions } from '../../redux/modules/actions'


class AnalystReferrals extends Component {
  state = {
    email:          ''
  };

  handlesOnEmailChange = (
    event: SyntheticEvent<>
  ) => {
    if (event) {
      event.preventDefault();
      // should add some validator before setState in real use cases
      this.setState({ email: event.target.value.trim() })
    }
  }

  handlesOnSubmit = async ( event: SyntheticEvent<> ) => {
    if (event) event.preventDefault()

    const { email } = this.state

    let { identity, regcode } = referralCode.getRefCodePair()
    console.log('ready to submit',email,identity,regcode)
    
    this.boundActions.referralSubmit( this.props.analyst.id, email, identity, regcode )

  }

  constructor( props ){
    super(props)
    const { dispatch } = this.props
    this.boundActions = bindActionCreators( { ...userActions }, dispatch )
  }

  render() {
    const { analyst, timestamp } = this.props
    const { email } = this.state

    console.log('analystReferrals props',this.props)
    return (
      <Panel className="panel-active-large card card-style">
        <Panel.Heading className="card-title"><i className="fa fa-user-circle"/>&nbsp;Referrals</Panel.Heading>

        <Panel.Body className="card-text">
          { analyst.referred_by ? <div className="small text-purple">Referred by: { analyst.referred_by }</div> : '' }

          { analyst.referrals.length ? 
            <div>
              <h4 className="row text-center text-orange">{ analyst.referrals.length } Referrals Made</h4>
              <div className="row">
              { ['referral made','registered','email','id'].map( (txt, idx) => <div key={idx} className="col-md-3">{txt}</div> ) }
              </div>
            </div> : ''
          }
          { analyst.referrals.map( ( referral, idx ) => // timestamp,reg_timestamp,email,analyst
            <div className="row" key={idx}>
              <div className="col-md-3 small"><Moment format="MM/DD/YYYY" from={timestamp} date={referral.timestamp*1000}/></div>
              <div className="col-md-3 small">{ referral.reg_timestamp ? <Moment format="MM/DD/YYYY" from={timestamp*1000} date={referral.reg_timestamp*1000}/> : 'no' }</div>
              <div className="col-md-3 small">{ referral.email }</div>
              <div className="col-md-3 small">{ referral.analyst ? referral.analyst : 'none' }</div>
            </div>
          ) }
          
          { analyst.referral_balance ? 
          <div>
            <hr/>
            <h4 className="row text-center text-orange">{analyst.referral_balance} available -- refer somebody</h4> 

            <div className="form-group">
              <label htmlFor="referral-email" className="control-label">
                Referral by email
              </label>
              <div className="row">
                <div className="col-md-6">
                  <input type="text" className="form-control" id="referral-email"
                    placeholder="Referral Email" value={ email }
                    onChange={ this.handlesOnEmailChange }
                  />
                </div>
                <div className="col-md-3">
                  <button className="form-control" onClick={ this.handlesOnSubmit }>
                    submit
                  </button>
                </div>
              </div>
            </div>
          </div> 
          : '' }
        </Panel.Body>
      </Panel>
    )
  }
}

export default connect()(AnalystReferrals)

