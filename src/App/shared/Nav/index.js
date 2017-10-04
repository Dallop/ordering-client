import React from 'react'
import { Flex, settings as s } from 'App/UI'

export const NavHeight = '50px'

const positions = [ 'flex-start', 'center', 'flex-end' ]
const Nav = ({ children }) => (
  <Flex
    zIndex='10'
    position='fixed'
    top='0'
    height={NavHeight}
    width='100%'
    maxWidth={s.primaryContainerWidth}
    px={2}
    justify='space-between'
    align='center'
    bg={s.colors.lightBase}
    borderBottom={`solid 1px ${s.colors.lightBaseBorder}`}
  >
    {
      children.map((child, i) => (
        <Flex width='33%' justify={positions[i]} key={i}>{child}</Flex>
      ))
    }
  </Flex>
)

export default Nav
