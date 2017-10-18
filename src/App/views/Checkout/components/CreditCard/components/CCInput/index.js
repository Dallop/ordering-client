import React from 'react'
import pt from 'prop-types'
import cc from 'create-react-class'
import { Input } from 'App/UI'
import { isValidInput } from '../../utils'
import { format } from './utils'

const CCInputUI = ({ value, onChange, className }) => (
  <Input {...{ value, onChange, className }} type='text' size='20' />
)

const CCInput = cc({
  MAX_LENGTH: 16,
  propTypes: {
    format: pt.oneOf([ 'standard', 'American Express' ]),
    value: pt.string,
    onChange: pt.func
  },
  defaultProps: { format: 'standard' },
  exceedsMax (value) {
    return value.length > this.MAX_LENGTH
  },
  onChange ({ target }) {
    const normalized = target.value.split(' ').join('')
    const lastInput = normalized[normalized.length - 1]

    if (!isValidInput(lastInput)) return

    this.props.onChange(normalized)
  },
  render () {
    const { onChange, props } = this
    const { value: unformattedVal, className, format: formatStyle } = props
    const value = format(unformattedVal, formatStyle)

    return <CCInputUI {...{ value, onChange, className }} />
  }
})

export default CCInput
