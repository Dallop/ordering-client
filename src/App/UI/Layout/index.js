import glamorous from 'glamorous'
import { space, width, fontSize, color } from 'styled-system'
import Base from '../Base'
import { fonts } from '../settings'

export const Box = glamorous(Base)(space, width, fontSize, color, {
  fontFamily: fonts.primary
})

export const Flex = glamorous(Box, {
  filterProps: [ 'align', 'justify', 'column', 'wrap' ]
})(
  { display: 'flex' },
  ({ wrap }) => wrap ? { flexWrap: 'wrap' } : null,
  ({ align }) => ({ alignItems: align }),
  ({ justify }) => ({ justifyContent: justify }),
  ({ column }) => column ? { flexDirection: 'column' } : null
)
