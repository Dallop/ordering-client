import React from 'react'
import { connect } from 'react-redux'
import { Flex, Text, Cart } from 'App/UI'
import { selectors } from '../../state/order'

const CartAmount = ({ total }) => (
  <Flex align='center'>
    <Cart />
    <Text ml={1}>${total.toFixed(2)}</Text>
  </Flex>
)

export default connect(state => ({ ...selectors.getOrderCosts(state) }))(
  CartAmount
)
