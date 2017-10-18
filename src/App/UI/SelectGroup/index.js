import React from 'react'
import { css, select as $ } from 'glamor'
import { RadioGroup as RG, Radio } from 'react-radio-group'
import { CheckboxGroup as CG, Checkbox } from 'react-checkbox-group'
import { colors as clr, fonts } from '../settings'
import { pxToEm, lightening as l, opacity } from '../utils'

let _id = 0
const makeUniqueId = value => {
  return `${value}-${_id++}`
}

const createOption = Option => ({ children, ...rest }) => {
  const id = makeUniqueId(rest.value)
  return (
    <div>
      <Option {...input} {...rest} id={id} />
      <label {...label} {...font} {...border} htmlFor={id}>
        {children}
      </label>
    </div>
  )
}

export const RadioGroup = RG
export const RadioOption = createOption(Radio)

export const CheckboxGroup = ({ selectedValue, ...rest }) => (
  <CG value={selectedValue} {...rest} />
)
export const CheckboxOption = createOption(Checkbox)

const label = css({
  display: 'block',
  borderRadius: pxToEm(5),
  transition: '.25s',
  backgroundColor: clr.lightBaseHighlight,
  padding: pxToEm(6),
  cursor: 'pointer'
})

const input = css(
  { opacity: 0, height: 0, width: 0, position: 'absolute' },
  $(`&:active ~ label`, {
    color: clr.success,
    backgroundColor: opacity(clr.success, 0.05),
    border: `solid 1px ${clr.success}`
  }),
  $(`&:checked ~ label`, {
    color: clr.success,
    backgroundColor: clr.lightBase,
    border: `solid 1px ${clr.success}`
  })
)

const font = css({
  fontFamily: fonts.primary,
  fontSize: pxToEm(15),
  color: clr.textOnLight,
  textIndent: pxToEm(10),
  fontWeight: 300
})

const border = css({
  border: `solid 1px ${l(clr.darkBase, 80)}`,
  ':hover': { border: `solid 1px ${clr.darkBase}` },
  ':focus': {
    outline: `none`,
    backgroundColor: clr.lightBase,
    boxShadow: `0px 1px 5px ${opacity(clr.darkBaseHighlight, 0.4)}`
  }
})
