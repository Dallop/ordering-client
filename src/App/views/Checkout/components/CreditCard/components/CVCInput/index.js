import React from 'react'
import cc from 'create-react-class'
import pt from 'prop-types'
import { Input } from 'App/UI'
import { isValidInput } from '../../utils'

const CVCInputUI = ({ value, onChange, className, format }) =>
  format === 'standard'
    ? <Input {...{ value, onChange, className }} type='text' size='3' />
    : <Input {...{ value, onChange, className }} type='text' size='4' />

const CVCInput = cc({
  MAX_LENGTH: 4,
  propTypes: {
    value: pt.string,
    format: pt.oneOf([ 'standard', 'American Express' ]),
    onChange: pt.func,
    max: pt.oneOfType([ pt.number, pt.string ])
  },
  exceedsMax (value) {
    const MAX = this.props.max ? this.props.max : this.MAX_LENGTH
    return value.length > MAX
  },
  onChange ({ target }) {
    const { value } = target
    const lastInput = value[value.length - 1]

    if (this.exceedsMax(value) || !isValidInput(lastInput)) return

    this.props.onChange(value)
  },
  render () {
    const { onChange, props } = this
    const { value, className, format } = props

    return <CVCInputUI {...{ value, onChange, className, format }} />
  }
})

export default CVCInput
