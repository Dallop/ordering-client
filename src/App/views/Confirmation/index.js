import React from 'react'
import { connect } from 'react-redux'
import cc from 'create-react-class'
import { Flex, Box, Title, Text, Button } from 'App/UI'
import { goToPhase } from 'App/state'
import { selectors } from 'App/state/logistics'
import confetti from './confetti.svg'

const getWaitTime = ({ order, locationConfig }) => {
  let waitTime = locationConfig.defaultWait
  order.forEach(o => {
    if (!o.waitTime) return

    if (o.waitTime > waitTime) {
      waitTime = o.waitTime
    }
  })
  return waitTime
}

const Confirmation = connect(state => ({
  waitTime: getWaitTime(state),
  location: selectors.getSelectedLocation(state)
}))(
  cc({
    render () {
      return (
        <Box bg='lightBaseHighlight' height='100%' paddingTop='20%'>
          <Flex column margin='0 auto' align='center' maxWidth='320px' px={1}>
            <Title fontSize={5}>Order Placed!</Title>
            <Box py={2}>
              <img src={confetti} width='100px' />
            </Box>
            <Box textAlign='center' pb={2}>
              <Text is='p' fontSize={4}>
                Your order should be ready in{' '}
                <Title>{this.props.waitTime}</Title>
                {' '}minutes!
              </Text>
            </Box>
            <Box textAlign='center' pb={2}>
              <Text fontSize={4}>
                <Box>
                  <Title>{this.props.location.title}</Title>
                </Box>
                {this.props.location.address}
              </Text>
            </Box>
            <Button onClick={() => this.props.dispatch(goToPhase(0))}>
              Place Another Order
            </Button>
          </Flex>
        </Box>
      )
    }
  })
)

export default Confirmation
