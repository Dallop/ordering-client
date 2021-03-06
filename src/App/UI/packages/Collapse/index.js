import React from 'react'
import cc from 'create-react-class'
import pt from 'prop-types'
import { Box } from '../Layout'
import { Title } from '../Text'
import { colors as clr } from '../settings'

const Collapse = cc({
  propTypes: { trigger: pt.string.isRequired, triggerWhenOpen: pt.string },
  getInitialState () {
    return { open: this.props.open || false }
  },
  toggleOpen () {
    this.setState(() => ({ open: !this.state.open }))
  },
  render () {
    const { open } = this.state
    const { children, trigger, triggerWhenOpen } = this.props
    let two = triggerWhenOpen || trigger
    return (
      <Box width='100%'>
        <Box
          bg={clr.base}
          cursor='pointer'
          transition='.2s'
          hover={{ backgroundColor: clr.baseHighlight }}
          py={2}
          px={2}
          onClick={this.toggleOpen}
          border={`solid 1px ${clr.baseBorder}`}
        >
          <Title fontSize={3}>{open ? two : trigger}</Title>
        </Box>
        <Box
          maxHeight={open ? '1000px' : 0}
          overflow='hidden'
          transition='.25s ease'
        >
          {children}
        </Box>
      </Box>
    )
  }
})

export default Collapse
