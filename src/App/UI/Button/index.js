import React from 'react'
import { css } from 'glamor'
import { colors, fonts } from '../settings'
import { lightening as l } from '../utils'

const base = css({ cursor: 'pointer', border: 'none', outline: 'none' })
const main = css({
  backgroundColor: colors.primaryCta,
  ':hover': { backgroundColor: l(colors.primaryCta, -10) },
  fontFamily: fonts.primary,
  color: colors.textOnDark,
  transition: '.25s',
  fontWeight: 'bold',
  fontSize: '1.2em',
  padding: '12px 0',
  width: '100%',
  borderRadius: '10px',
  border: `solid 1px ${colors.lightBaseHighlight}`,
  letterSpacing: '.2'
})

const Button = ({ children, ...props }) => (
  <button {...props} {...base} {...main}>
    {children}
  </button>
)

export default Button
