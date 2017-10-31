import React from 'react'
import { css } from 'glamor'
import { colors as clr, fonts } from '../settings'
import {
  pxToEm,
  lightening as l,
  opacity,
  createPlaceholderStyles
} from '../utils'

export const Input = ({ baseRef = _ => _, ...rest }) => (
  <input {...rest} {...base} {...font} {...border} ref={baseRef} />
)

export const Textarea = (
  { baseRef = _ => _, height = pxToEm(100), ...rest }
) => (
  <textarea
    {...css({ height })}
    {...rest}
    {...base}
    {...font}
    {...border}
    {...textarea}
    ref={baseRef}
  />
)

export const Select = ({ ...rest }) => (
  <select {...rest} {...base} {...font} {...border} />
)

const textarea = css({ resize: 'vertical' })
const base = css({
  width: '100%',
  height: pxToEm(40),
  borderRadius: pxToEm(5),
  transition: '.25s',
  ...createPlaceholderStyles({ opacity: 0.5 }),
  backgroundColor: clr.lightBaseHighlight
})

const font = css({
  fontFamily: fonts.primary,
  fontSize: pxToEm(15),
  color: clr.textOnLight,
  textIndent: pxToEm(10),
  fontWeight: 300
})

const border = css({
  border: `solid 1px ${l(clr.darkBase, 80)}`,
  ':focus': {
    outline: `none`,
    backgroundColor: clr.lightBase,
    // outline: `solid 1px ${clr.darkBaseHighlight}`,
    boxShadow: `0px 1px 5px ${opacity(clr.darkBaseHighlight, 0.4)}`
  }
})
