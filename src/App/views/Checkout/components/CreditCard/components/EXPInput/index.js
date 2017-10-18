import React from 'react'
import pt from 'prop-types'
import cc from 'create-react-class'
import { Select } from 'App/UI'
import { createOptionValues, format } from './utils'

const useContainer = UI => cc({
  propTypes: { value: pt.string, onChange: pt.func, className: pt.string },
  onChange ({ target }) {
    const { value } = target

    this.props.onChange(value)
  },
  render () {
    const { onChange, props } = this
    const { value, className } = props

    return <UI {...{ value, onChange, className }} />
  }
})

const renderOptions = (values, transform) => values.map((value, i) => {
  const val = transform(value)
  return <option key={i} value={val}>{val}</option>
})

const ExpMonthUI = ({ value = 'MM', onChange, className }) => (
  <Select {...{ value, onChange, className }}>
    <option value={value}>{value}</option>
    {renderOptions(createOptionValues(1, 12), format)}
  </Select>
)

export const ExpMonthInput = useContainer(ExpMonthUI)

const ExpYearUI = (
  {
    value = 'YY',
    onChange,
    className,
    start = new Date().getFullYear(),
    range = 15
  }
) => (
  <Select {...{ value, onChange, className }}>
    <option value={value}>{value}</option>
    {renderOptions(createOptionValues(start, range), format)}
  </Select>
)

export const ExpYearInput = useContainer(ExpYearUI)
