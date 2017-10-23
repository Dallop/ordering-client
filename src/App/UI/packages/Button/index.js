import React from 'react'
import { css } from 'glamor'
import { colors, fonts } from '../settings'
import { lightening as l, pxToEm } from '../utils'

const base = css({ cursor: 'pointer', border: 'none', outline: 'none' })
const main = css({
  fontFamily: fonts.primary,
  color: colors.textOnDark,
  transition: '.25s',
  fontWeight: 'bold',
  fontSize: '1.2em',
  padding: '12px 0',
  width: '100%',
  borderRadius: pxToEm(5),
  border: `solid 1px ${colors.lightBaseHighlight}`,
  letterSpacing: '.2'
})

const themes = {
  primary: css({
    backgroundColor: colors.primaryCta,
    ':hover': { backgroundColor: l(colors.primaryCta, -10) }
  }),
  secondary: css({
    backgroundColor: colors.secondaryCta,
    ':hover': { backgroundColor: l(colors.secondaryCta, -10) }
  })
}

const Button = ({ children, theme = 'primary', ...props }) => (
  <button {...props} {...base} {...main} {...themes[theme]}>
    {children}
  </button>
)

export default Button
