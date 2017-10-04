import React from 'react'
import { css } from 'glamor'
import { colors as clr, fonts } from '../settings'
import { pxToEm, opacity, createPlaceholderStyles } from '../utils'

export const Input = props => (
  <input {...props} {...base} {...font} {...border} />
)

const base = css({
  width: '100%',
  height: pxToEm(40),
  borderRadius: pxToEm(5),
  transition: '.25s',
  ...createPlaceholderStyles({ opacity: 0.5 })
})

const font = css({
  fontFamily: fonts.primary,
  fontSize: pxToEm(15),
  color: clr.textOnLight,
  textIndent: pxToEm(10),
  fontWeight: 300
})

const border = css({
  border: `solid 1px ${clr.darkBase}`,
  ':focus': {
    outline: `none`,
    // outline: `solid 1px ${clr.darkBaseHighlight}`,
    boxShadow: `0px 1px 8px ${opacity(clr.darkBaseHighlight, 0.6)}`
  }
})
