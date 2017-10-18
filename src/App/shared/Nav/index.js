import React from 'react'
import { Flex, settings as s } from 'App/UI'

export const NavHeight = '50px'

const Nav = ({ left, center, right }) => (
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
    <Flex width='33%' justify='flex-start'>{left}</Flex>
    <Flex width='33%' justify='center'>{center}</Flex>
    <Flex width='33%' justify='flex-end'>{right}</Flex>
  </Flex>
)

export default Nav
