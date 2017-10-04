import React from 'react'
import cc from 'create-react-class'
import { connect } from 'react-redux'
import { phaseBack } from 'App/state'

const BackAction = cc({
  render () {
    return (
      <div
        onClick={() => this.props.dispatch(phaseBack())}
        style={{ cursor: 'pointer' }}
      >
        {this.props.children}
      </div>
    )
  }
})

export default connect()(BackAction)
