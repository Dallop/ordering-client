import React from 'react'
import { Box } from '../'
export default ({ props, children }) => (
  <Box touchCallout='none' userSelect='none' {...props}>{children}</Box>
)
