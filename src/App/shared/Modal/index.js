import React from 'react'
import ReactModal from 'react-modal'
import { css } from 'glamor'
import { settings, utils } from 'App/UI'

const BaseModal = (
  {
    width,
    height,
    maxWidth,
    maxHeight = '100%',
    minWidth,
    minHeight,
    overlayBackgroundColor = utils.opacity(settings.colors.darkBase, 0.8),
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
        boxShadow: `0 2px 7px 0 ${utils.opacity('#243645', 0.2)}`
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
        backgroundColor: overlayBackgroundColor
      }).toString(),
      ...rest
    }}
  />
)

export default BaseModal
