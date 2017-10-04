import './style'
import React from 'react'
import pt from 'prop-types'
import { connect } from 'react-redux'
import cc from 'create-react-class'
import { Flex, Box, settings } from 'App/UI'

const config = {
  phases: [ 'logistics', 'placeOrder', 'checkout' ],
  logistics: { Component: require('./views').Logistics },
  placeOrder: { Component: require('./views').PlaceOrder },
  checkout: { Component: require('./views').Checkout }
}

const App = cc({
  propTypes: { orderPhaseIndex: pt.number },
  render () {
    const phase = config.phases[this.props.orderPhaseIndex]
    const View = config[phase].Component
    return (
      <Box bg='rgba(0, 0, 0, 0.8)' w='100%' height='100%'>
        <Flex
          column
          maxWidth={settings.primaryContainerWidth}
          m='0 auto'
          bg='lightBase'
          height='100%'
          position='relative'
        >
          <View />
        </Flex>
      </Box>
    )
  }
})

export default connect(({ orderPhaseIndex }) => ({ orderPhaseIndex }))(App)
