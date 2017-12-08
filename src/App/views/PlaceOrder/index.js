import React from 'react'
import cc from 'create-react-class'
import pt from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { css } from 'glamor'
import { capitalize, toPrice } from 'utils/rendering'
import {
  Flex,
  Box,
  Collapse,
  Button,
  Title,
  Text,
  CloseAction,
  settings
} from 'App/UI'
import Nav, { NavHeight } from 'App/shared/Nav'
import CartAmount from './components/CartAmount'
import ItemMenu from './components/ItemMenu'
import { getMenuEntities, selectors } from './state'
import { removeFromOrder, selectors as orderSelectors } from './state/order'
const { colors: clr } = settings

const MenuListItem = ({ name, description, servingPortions }) => (
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
      <Title>{toPrice(servingPortions[0].price)}</Title>
    </Flex>
  </Box>
)

const Menu = ({ menuCategories = [], menuItems, onItemSelect }) => (
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
    getMenuData: pt.func,
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
  componentDidMount () {
    this.props.getMenuData()
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
    return this.state.showItemMenu
      ? { right: <CloseAction onClick={this.closeItemMenu} /> }
      : this.state.showCart
        ? { right: <CloseAction onClick={this.closeCartView} /> }
        : {
          left: (
            <Link to={`/order/${this.props.match.params.orgId}`}>Location</Link>
          ),
          center: (
            <Box onClick={this.openCartView} cursor='pointer'>
              <CartAmount />
            </Box>
          )
        }
  },
  render () {
    const { showItemMenu, showCart, activeItemId } = this.state
    const { menuItems } = this.props

    return (
      <div {...fillViewportStyles}>
        <Box paddingBottom={NavHeight}>
          <Nav {...this.renderNav()} />
        </Box>
        <div ref={this.getSize} {...fillViewportStyles}>
          {
            !showItemMenu &&
              !showCart &&
              <Menu {...this.props} onItemSelect={this.openItemMenu} />
          }
          <PopupView isOpen={showItemMenu} height={this.state.viewHeight}>
            {
              showItemMenu &&
                (
                  <ItemMenu
                    itemDetails={menuItems[activeItemId]}
                    onSuccessfulAddToOrder={this.closeItemMenu}
                    children={
                      onAddToOrder => (
                        <AnchorContainer
                          children={
                            (
                              <Button
                                onClick={onAddToOrder}
                                children='Add To Order'
                              />
                            )
                          }
                        />
                      )
                    }
                  />
                )
            }
            <Box py='50px' />
          </PopupView>
          <PopupView isOpen={showCart} height={this.state.viewHeight}>
            {
              showCart &&
                (
                  <OrderCart
                    moveToCheckout={
                      () =>
                        this.props.history.push({
                          pathname: `${this.props.match.url}/checkout`
                        })
                    }
                    location={this.props.location}
                  />
                )
            }
          </PopupView>
        </div>
      </div>
    )
  }
})

export default connect(
  (state, props) => ({
    order: state.order,
    ...selectors.getMenu(props.match.params.menuId)(state)
  }),
  (dispatch, props) => ({
    getMenuData: () => dispatch(getMenuEntities(props.match.params))
  })
)(PlaceOrder)

const OrderInstructions = ({ copy }) => (
  <Text is='p' fontSize='12px' fontStyle='italic' pr={4} pt={'4px'}>
    <span style={{ fontWeight: 'bold' }}>
      Instructions:
    </span>{' '}
    {copy}
  </Text>
)

/**
 * 1. 15px, 16px ml box is same as CloseAction to ensure alignment
 * it's ugly and not very DRY but it works
 */
const SelectionLineItem = ({ name, cost, inverted }) => (
  <Flex justify='space-between'>
    <Text fontSize='12px'>
      {inverted ? 'No ' : ''}{name}
    </Text>
    <Flex>
      <Text fontSize='12px'>
        {inverted ? '' : cost ? toPrice(cost) : ''}
      </Text>
      <Box width='15px' ml='16px' />
    </Flex>
  </Flex>
)

const OrderItem = ({ item, onRequestRemove }) => (
  <Flex
    is='li'
    justify='space-between'
    py={2}
    px={2}
    borderBottom={`solid 1px ${clr.baseBorder}`}
    align='center'
    column
  >
    <Flex justify='space-between' width='100%'>
      <Flex>
        <Title mr={1}>{item.quantity}</Title>
        <Flex column>
          <Text>{item.name}</Text>
        </Flex>
      </Flex>
      <Flex align='center' verticalAlign='middle'>
        <Title>
          {
            toPrice(
              item.servingPortions[item.priceVariationIndex].price *
                item.quantity
            )
          }
        </Title>
        <Box ml={2} mb={'-3px'} cursor='pointer'>
          <CloseAction
            size='15px'
            color={clr.primaryCta}
            onClick={onRequestRemove}
          />
        </Box>
      </Flex>
    </Flex>
    <Flex width='100%' column>
      {item.selectionSets.map(
          (set, id) => set.selections.length ? <Box key={set.id} pt='2px'>
            <Title fontSize='12px' fontStyle='italic'>{set.name}</Title>
            <Box pt={'2px'}>
              {
                  set.selections.map((sel, i) => (
                    <SelectionLineItem
                      key={i}
                      {...sel}
                      inverted={set.optionsAreDefaults}
                    />
                  ))
                }
            </Box>
          </Box> : undefined
        )}
      {item.instructions && <OrderInstructions copy={item.instructions} />}
    </Flex>
  </Flex>
)

const LineItem = ({ label, value, hasTopline }) => (
  <Flex
    justify='space-between'
    borderTop={`solid 1px ${hasTopline ? clr.lightBaseBorder : 'transparent'}`}
    py={`3px`}
  >
    <Text>{label}</Text>
    <Text>
      {value}
    </Text>
  </Flex>
)

const OrderCart = connect(
  state => ({
    ...orderSelectors.getOrderCosts(state),
    orderContents: orderSelectors.getOrderContents(state),
    minimumOrderValue: state.locationConfig.minimumOrderValue
  }),
  dispatch => ({
    removeItemFromOrder: index => dispatch(removeFromOrder(index))
  })
)(
  cc({
    propTypes: {
      orderContents: pt.array,
      tax: pt.number,
      subtotal: pt.number,
      total: pt.number,
      minimumOrderValue: pt.number
    },
    getInitialState () {
      return { error: false }
    },
    removeItem (index) {
      this.props.removeItemFromOrder(index)
    },
    componentDidMount () {
      const { total, minimumOrderValue } = this.props
      if (total < minimumOrderValue) {
        this.setState(() => ({
          error: `Order amount cannot be below ${toPrice(
            minimumOrderValue
          )} minimum.`
        }))
      }
    },
    requestCheckout () {
      const { total, minimumOrderValue } = this.props
      if (total >= minimumOrderValue) {
        this.setState(() => ({ error: '' }))
        this.props.moveToCheckout()
      }
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
                [ 'subtotal', 'tax', 'total' ].map((cost, i) => (
                  <LineItem
                    key={cost}
                    label={capitalize(cost)}
                    value={toPrice(this.props[cost])}
                    hasTopline={i > 0}
                  />
                ))
              }
            </Box>
            <Box pb={this.state.error ? 1 : 0} pl={1} transition='.25s'>
              <Text error>{this.state.error}</Text>
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

const fillViewportStyles = css({
  display: 'flex',
  position: 'relative',
  flexDirection: 'column',
  flexGrow: 1,
  overflow: 'auto'
})
