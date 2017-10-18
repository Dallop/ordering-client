import React from 'react'
import cc from 'create-react-class'
import { connect } from 'react-redux'
import { Flex, Text, Cart } from 'App/UI'
import { selectors } from '../../state/order'

const CartAmount = cc({
  getInitialState () {
    return { applyColor: false }
  },
  componentWillReceiveProps (props, next) {
    console.log(props, next, '[][][]')
  },
  toggleApplyColor () {
    this.setState(() => ({ applyColor: !this.state.applyColor }))
  },
  blinkColor () {
    this.toggleApplyColor()
    window.setTimeout(this.toggleApplyColor, 100)
  },
  render () {
    return (
      <Flex align='center'>
        <Cart />
        <Text ml={1}>${this.props.total.toFixed(2)}</Text>
      </Flex>
    )
  }
})

export default connect(state => ({
  total: selectors.getOrderCosts(state).total
}))(CartAmount)
