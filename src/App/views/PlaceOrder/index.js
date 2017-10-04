import React from 'react'
import cc from 'create-react-class'
import pt from 'prop-types'
import { connect } from 'react-redux'
import { css } from 'glamor'
import {
  Flex,
  Box,
  Input,
  Collapse,
  Button,
  Title,
  Text,
  Close,
  settings
} from 'App/UI'
import { phaseForward, phaseBack } from 'App/state'
import Nav, { NavHeight } from 'App/shared/Nav'
import BackAction from 'App/shared/BackAction'
import CartAmount from './components/CartAmount'
import QuantityInput from './components/QuantityInput'
import { selectors } from './state'
import {
  addToOrder,
  removeFromOrder,
  selectors as orderSelectors
} from './state/order'
const { colors: clr } = settings

const toPrice = num => `$${num.toFixed(2)}`
const MenuListItem = ({ name, description, price }) => (
  <Box
    bg={clr.lightBase}
    hover={{ backgroundColor: clr.lightBaseHighlight }}
    border={`solid 1px ${clr.lightBaseBorder}`}
    cursor='pointer'
    p={2}
  >
    <Title>{name}</Title>
    <Flex justify='space-between'>
      <Text is='p' pr={2}>{description}</Text>
      <Title>{toPrice(price)}</Title>
    </Flex>
  </Box>
)

const Menu = ({ menuCategories, menuItems, onItemSelect }) => (
  <Box>
    {menuCategories.map((mcat, i) => (
      <Collapse trigger={mcat.name} key={i}>
        <Box is='ul'>
          {mcat.items.map((id, i) => (
            <Box is='li' onClick={() => onItemSelect(id)} key={i}>
              <MenuListItem {...menuItems[id]} />
            </Box>
              ))}
        </Box>
      </Collapse>
      ))}
  </Box>
)

const ItemMenu = connect()(
  cc({
    getInitialState () {
      return { quantity: 1, instructions: '' }
    },
    onQuantityChange (newQuantity) {
      this.setState(() => ({ quantity: newQuantity }))
    },
    onInstructionChange (value) {
      this.setState(() => ({ instructions: value }))
    },
    addToOrder () {
      this.props.dispatch(
        addToOrder({
          itemMenuId: this.props.id,
          quantity: this.state.quantity,
          instructions: this.state.instructions
        })
      )
      this.props.onAddToOrder()
    },
    render () {
      const { name, description, price } = this.props
      return (
        <Box position='relative'>
          <Box p={3}>
            <Flex justify='space-between'>
              <Title fontSize={4}>{name}</Title>
              <Title fontSize={3}>{toPrice(price)}</Title>
            </Flex>
            <Box py={2}>
              <Text is='p'>{description}</Text>
            </Box>
            <Box mt={3}>
              <Text>Select Quantity</Text>
              <Box mt={1}>
                <QuantityInput
                  quantity={this.state.quantity}
                  onChange={this.onQuantityChange}
                  inputSize={2}
                />
              </Box>
            </Box>
            <Box mt={3}>
              <Text>Special Instructions (optional)</Text>
              <Box mt={1}>
                <Input
                  onChange={e => this.onInstructionChange(e.target.value)}
                  value={this.state.instructions}
                />
              </Box>
            </Box>
          </Box>
          <AnchorContainer>
            <Button onClick={this.addToOrder}>
              Add To Order
            </Button>
          </AnchorContainer>
        </Box>
      )
    }
  })
)

const AnchorContainer = ({ children }) => (
  <Box
    position='fixed'
    bottom='0'
    width='100%'
    animation={`${delayedPopup} .6s`}
    p={2}
    bg='lightBase'
    maxWidth={settings.primaryContainerWidth}
    children={children}
  />
)

let popup = css.keyframes({
  '0%': { transform: 'translateY(100%)', opacity: 0 },
  '100%': { transform: 'translateY(calc(0%))', opacity: 1 }
})

let delayedPopup = css.keyframes({
  '50%': { transform: 'translateY(100%)', opacity: 0 },
  '100%': { transform: 'translateY(calc(0%))', opacity: 1 }
})

const PopupView = cc({
  propTypes: {
    children: pt.node,
    onRequestClose: pt.func,
    isOpen: pt.bool,
    height: pt.number
  },
  render () {
    const { isOpen, height, children } = this.props
    if (!isOpen) return null
    return (
      <Box
        bg='lightBase'
        position='absolute'
        top='0'
        left='0'
        w='100%'
        animation={`${popup} .25s`}
        height={height}
      >
        {isOpen && children}
      </Box>
    )
  }
})

/**
 * 1. using a lower case div in order to have ref access
 */
const PlaceOrder = cc({
  propTypes: {
    menuCategories: pt.array,
    menuItems: pt.object,
    onBack: pt.func
  },
  getInitialState () {
    return {
      viewHeight: null,
      showItemMenu: false,
      activeItemId: 2,
      showCart: false
    }
  },
  getSize (node) {
    this.setState(() => ({
      viewHeight: node.offsetHeight,
      viewWidth: node.offsetWidth
    }))
  },
  openItemMenu (itemId) {
    this.closeAllPopups()
    this.setState(prev => ({ showItemMenu: true, activeItemId: itemId }))
  },
  closeItemMenu () {
    this.setState(prev => ({ showItemMenu: false }))
  },
  openCartView () {
    this.closeAllPopups()
    this.setState(prev => ({ showCart: true }))
  },
  closeCartView () {
    this.setState(prev => ({ showCart: false }))
  },
  closeAllPopups () {
    this.setState(prev => ({ showCart: false, showItemMenu: false }))
  },
  renderNav () {
    const placeholder = <Box />
    const openCart = (
      <Box onClick={this.openCartView} cursor='pointer'><CartAmount /></Box>
    )
    return this.state.showItemMenu
      ? [ placeholder, openCart, <CloseAction onClick={this.closeItemMenu} /> ]
      : this.state.showCart
        ? [
          placeholder,
          placeholder,
          <CloseAction onClick={this.closeCartView} />
        ]
        : [ <BackAction>Location</BackAction>, openCart, placeholder ]
  },
  render () {
    const { showItemMenu, showCart } = this.state
    return (
      <div {...fillViewportStyles}>
        <Box paddingBottom={NavHeight}>
          <Nav>
            {this.renderNav()}
          </Nav>
        </Box>
        <div ref={this.getSize} {...fillViewportStyles}>
          {
            (!showItemMenu || !showCart) &&
              <Menu {...this.props} onItemSelect={this.openItemMenu} />
          }
          <PopupView isOpen={showItemMenu} height={this.state.viewHeight}>
            {
              showItemMenu &&
                (
                  <ItemMenu
                    {...this.props.menuItems[this.state.activeItemId]}
                    onAddToOrder={this.closeItemMenu}
                  />
                )
            }
          </PopupView>
          <PopupView isOpen={showCart} height={this.state.viewHeight}>
            {showCart && <OrderCart />}
          </PopupView>
        </div>
      </div>
    )
  }
})

export default connect(state => ({
  order: state.order,
  ...selectors.getMenu()
}))(PlaceOrder)

const OrderInstructions = ({ copy }) => (
  <Text is='p' fontSize='12px' fontStyle='italic' pr={4} pt={'2px'}>
    <span style={{ fontWeight: 'bold' }}>
      Instructions:
    </span>{' '}
    {copy}
  </Text>
)

const OrderItem = ({ item, onRequestRemove }) => (
  <Flex
    is='li'
    justify='space-between'
    py={2}
    px={2}
    borderBottom={`solid 1px ${clr.baseBorder}`}
    align='center'
  >
    <Flex>
      <Title mr={1}>{item.quantity}</Title>
      <Flex column>
        <Text>{item.name}</Text>
        {item.instructions && <OrderInstructions copy={item.instructions} />}
      </Flex>
    </Flex>
    <Flex align='center' verticalAlign='middle'>
      <Title>{toPrice(item.price * item.quantity)}</Title>
      <Box ml={2} mb={'-3px'} cursor='pointer'>
        <CloseAction
          size='15px'
          color={clr.primaryCta}
          onClick={onRequestRemove}
        />
      </Box>
    </Flex>
  </Flex>
)

const LineItem = ({ label, value, hasTopline }) => (
  <Flex justify='space-between' borderTop={hasTopline} py={`3px`}>
    <Text>{label}</Text>
    <Text>
      {value}
    </Text>
  </Flex>
)

const OrderCart = connect(
  state => ({
    ...orderSelectors.getOrderCosts(state),
    orderContents: orderSelectors.getOrderContents(state)
  }),
  dispatch => ({ moveToCheckout: () => dispatch(phaseForward()) })
)(
  cc({
    propTypes: {
      orderContents: pt.array,
      tax: pt.number,
      subtotal: pt.number,
      total: pt.number
    },
    costs: [ 'subtotal', 'tax', 'total' ],
    removeItem (index) {
      this.props.dispatch(removeFromOrder(index))
    },
    requestCheckout () {
      this.props.moveToCheckout()
    },
    render () {
      return (
        <Box bg={clr.lightBaseHighlight} height='100%'>
          <Box is='ul' pb='250px'>
            {
              this.props.orderContents.map((item, i) => (
                <OrderItem
                  key={i}
                  item={item}
                  onRequestRemove={() => this.removeItem(i)}
                />
              ))
            }
          </Box>
          <AnchorContainer>
            <Box pb={1}>
              {
                this.costs.map((cost, i) => (
                  <LineItem
                    label={cost}
                    value={toPrice(this.props[cost])}
                    hasTopline={i > 0}
                  />
                ))
              }
            </Box>
            <Button theme='secondary' onClick={this.requestCheckout}>
              Checkout
            </Button>
          </AnchorContainer>
        </Box>
      )
    }
  })
)

const CloseAction = ({ onClick, color = clr.textOnLight, size = '25px' }) => (
  <Close
    {...{
      size,
      onClick,
      color,
      css: { cursor: 'pointer', transition: '.2s' },
      onHover: { transform: 'scale(1.1)' }
    }}
  />
)

const fillViewportStyles = css({
  display: 'flex',
  position: 'relative',
  flexDirection: 'column',
  flexGrow: 1,
  overflow: 'auto'
})
