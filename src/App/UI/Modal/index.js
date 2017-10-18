import React from 'react'
import ReactModal from 'react-modal'
import { css } from 'glamor'
import { colors } from '../settings'
import { CloseAction } from '../Icons'
import { Flex, Box } from '../Layout'
import { opacity } from '../utils'

const BaseModal = (
  {
    width,
    height,
    maxWidth,
    maxHeight = '100%',
    minWidth,
    minHeight,
    overlayBackgroundColor = opacity(colors.darkBase, 0.8),
    ...rest
  }
) => (
  <ReactModal
    {...{
      portalClassName: 'boostly',
      className: css({
        overflow: 'auto',
        position: 'relative',
        borderRadius: '4px',
        outline: 'none',
        display: 'block',
        width,
        height,
        maxWidth,
        maxHeight,
        minWidth,
        minHeight,
        backgroundColor: 'white',
        boxShadow: `0 2px 7px 0 ${opacity('#243645', 0.2)}`
      }).toString(),
      overlayClassName: css({
        position: 'fixed',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: overlayBackgroundColor,
        zIndex: 10
      }).toString(),
      ...rest
    }}
  />
)

const Modal = ({ heading, onRequestClose, ...props }) => (
  <BaseModal {...props} minWidth='320px' onRequestClose={onRequestClose}>
    <Box>
      <Box px={2} py={1}>
        <Flex justify='space-between' align='center'>
          <Box>
            {heading}
          </Box>
          <CloseAction onClick={onRequestClose} />
        </Flex>
      </Box>
      {props.children}
    </Box>
  </BaseModal>
)

export default Modal
