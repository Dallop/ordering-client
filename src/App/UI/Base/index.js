import React from 'react'
import glam from 'glamorous'
import { removeProps } from 'styled-system'

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

const Base = ({ is = 'div', ...rest }) => {
  const Component = glam[capitalize(is)]
  return <Component {...removeProps(rest)} />
}

export default Base
