import React from 'react'
import glamorous from 'glamorous'
import { fontSize, space } from 'styled-system'
import Base from '../Base'
import { fonts, colors } from '../settings'

const TextBase = glamorous(({ is = 'span', onDark, ...rest }) => (
  <Base {...rest} is={is} />
))(fontSize, space)

export const Text = glamorous(TextBase)(
  { fontFamily: fonts.primary, color: colors.textOnLight, fontWeight: 300 },
  ({ onDark = false }) => onDark ? { color: colors.textOnDark } : undefined
)

export const Title = glamorous(Text)({
  fontWeight: 'bold',
  letterSpacing: '0.1'
})
