import React from 'react'
import { connect } from 'react-redux'
import cc from 'create-react-class'
import pt from 'prop-types'
import { capitalize } from 'utils/rendering'
import { Box, Flex, Text, Title, Input, Button, settings } from 'App/UI'
import { phaseForward } from 'App/state'
import { selectors as orderSelectors } from 'App/views/PlaceOrder/state/order'
import Nav, { NavHeight } from 'App/shared/Nav'
import BackAction from 'App/shared/BackAction'
import CreditCard from './components/CreditCard'

const { colors: clr } = settings
const toPrice = num => `$${num.toFixed(2)}`

const InputField = ({ ...rest, label }) => (
  <Flex py={1}>
    <Flex pr={2} width='90px' align='center'>
      <Text>{label}</Text>
    </Flex>
    <Box flexGrow='1' width='200px'>
      <Input {...rest} />
    </Box>
  </Flex>
)

const Fieldset = ({ label, children }) => (
  <Box pb={2}>
    <Box
      bg='lightBaseHighlight'
      p={2}
      border={`solid 1px ${clr.base}`}
      borderTopLeftRadius='5px'
      borderTopRightRadius='5px'
    >
      <Title>{label}</Title>
    </Box>
    <Box py={2} px={1}>
      {children}
    </Box>
  </Box>
)

const Checkout = connect(
  state => ({ ...orderSelectors.getOrderCosts(state) }),
  dispatch => ({ moveToConfirmation: () => dispatch(phaseForward()) })
)(
  cc({
    propTypes: {
      tax: pt.number,
      subtotal: pt.number,
      total: pt.number,
      moveToConfirmation: pt.func
    },
    getInitialState () {
      return { name: '', phone: '', email: '', card: {} }
    },
    onCardUpdate (card) {
      this.setState(() => ({ card }))
    },
    updateField (key) {
      return e => {
        let state = { [key]: e.target.value }
        this.setState(() => state)
      }
    },
    completeOrder () {
      this.props.moveToConfirmation()
    },
    render () {
      return (
        <Box pt={NavHeight} overflow='auto'>
          <Nav left={<BackAction children='Order' />} />
          <Box
            is='form'
            py={3}
            width='100%'
            maxWidth='450px'
            margin='0 auto'
            onSubmit={this.completeOrder}
          >
            <Fieldset label='Contact Info'>
              <InputField
                label='Name'
                value={this.state.name}
                onChange={this.updateField('name')}
              />
              <InputField
                label='Email'
                value={this.state.email}
                onChange={this.updateField('email')}
              />
              <InputField
                label='Phone #'
                value={this.state.phone}
                onChange={this.updateField('phone')}
              />
            </Fieldset>
            <Fieldset label='Payment'>
              <CreditCard onUpdate={this.onCardUpdate} />
            </Fieldset>
            <Box px={1}>
              {
                [ 'subtotal', 'tax', 'total' ].map((cost, i) => (
                  <LineItem
                    key={cost}
                    bolded={cost === 'total'}
                    label={capitalize(cost)}
                    value={toPrice(this.props[cost])}
                    hasTopline={i > 0}
                  />
                ))
              }
            </Box>
            <Button theme='secondary' type='submit'>
              Complete Order
            </Button>
          </Box>
        </Box>
      )
    }
  })
)

const LineItem = ({ label, value, hasTopline, bolded }) => (
  <Flex
    justify='space-between'
    borderTop={`solid 1px ${hasTopline ? clr.lightBaseBorder : 'transparent'}`}
    py={1}
  >
    <Text fontWeight={bolded ? 'bold' : 300}>{label}</Text>
    <Text fontWeight={bolded ? 'bold' : 300}>
      {value}
    </Text>
  </Flex>
)

export default Checkout
