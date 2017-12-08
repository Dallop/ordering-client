import './style'
import React from 'react'
import { connect } from 'react-redux'
import { Route, withRouter } from 'react-router-dom'
import cc from 'create-react-class'
import { getSettings } from 'App/state'
import { Flex, Box, settings } from 'App/UI'

const App = cc({
  componentDidMount () {
    this.props.dispatch(getSettings())
  },
  render () {
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
          <Route
            exact
            path='/order/:orgId'
            component={require('./views').Logistics}
          />
          <Route
            exact
            path='/order/:orgId/:menuId'
            component={require('./views').PlaceOrder}
          />
          <Route
            exact
            path='/order/:orgId/:menuId/checkout'
            component={require('./views').Checkout}
          />
        </Flex>
      </Box>
    )
  }
})

export default withRouter(connect()(App))
