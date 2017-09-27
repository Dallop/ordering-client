import './style'
import React from 'react'
import cc from 'create-react-class'
import { Box } from 'App/UI'

const Header = () => <Box is='header' height='100px' bg='white' />

const config = {
  phases: [ 'logistics', 'menu', 'checkout' ],
  logistics: {
    Component: require('./views').Logistics,
    extractProps: props => ({
      options: {
        location: [
          {
            id: 1,
            title: 'Orem MidiCi',
            address: '541 E University Pkwy, UT 84097'
          },
          {
            id: 2,
            title: 'American Fork MidiCi',
            address: '1723 E Main St. American Fork, UT 84003'
          }
        ],
        method: [ { type: 'PICK_UP', label: 'Pick Up' } ],
        timing: [ { type: 'NOW', label: 'Order for Now' } ]
      }
    })
  }
}

const App = cc({
  getInitialState () {
    return { phaseIndex: 0 }
  },
  render () {
    const phase = config.phases[this.state.phaseIndex]
    const View = config[phase].Component
    return (
      <Box bg='rgba(0, 0, 0, 0.8)' w='100%' height='100%'>
        <Box maxWidth='600px' m='0 auto' bg='lightBase' height='100%'>
          <Header />
          <View {...config[phase].extractProps({ ...this.state })} />
        </Box>
      </Box>
    )
  }
})

export default App
