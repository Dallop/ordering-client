import React from 'react'
import cc from 'create-react-class'
import { Box, Flex, Text, Title, Input } from 'App/UI'
import Nav, { NavHeight } from 'App/shared/Nav'
import BackAction from 'App/shared/BackAction'

const Checkout = cc({
  getInitialState () {
    return { name: '', phone: '', email: '' }
  },
  render () {
    return (
      <Box pb={NavHeight}>
        <Nav>{[ <BackAction children='Order' /> ]}</Nav>
        <Box p={2}>
          <Box>
            <Title>Contact</Title>
          </Box>
        </Box>
      </Box>
    )
  }
})

export default Checkout
