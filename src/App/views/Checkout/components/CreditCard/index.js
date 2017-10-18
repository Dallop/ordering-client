import React from 'react'
import PropTypes from 'prop-types'
import cc from 'create-react-class'
import { Flex, Box } from 'App/UI'
import { determineCCType, determineFormat } from './utils'
import CCInput from './components/CCInput'
import CVCInput from './components/CVCInput'
import { ExpMonthInput, ExpYearInput } from './components/ExpInput'

const CreditCardUI = (
  { onSubmit, onChange, values: { number, cvc, expMo, expYr, type }, style }
) => (
  <Flex column {...{ onSubmit }}>
    <Box pb={2}>
      <Flex column is='label'>
        <Box pb={1}>
          <span>Card Number</span>
        </Box>
        <CCInput
          value={number}
          onChange={onChange.bind(null, 'number')}
          format={determineFormat(type)}
        />
      </Flex>
    </Box>
    <Flex pb={2} justify='space-between'>
      <div>
        <Flex column>
          <Box pb={1}>
            <span>Expiration Date</span>
          </Box>
          <Flex align='center' width={'200px'} justify='space-between'>
            <ExpMonthInput
              value={expMo}
              onChange={onChange.bind(null, 'expMo')}
            />
            <span style={{ padding: '0 1em' }}> / </span>
            <ExpYearInput
              value={expYr}
              onChange={onChange.bind(null, 'expYr')}
            />
          </Flex>
        </Flex>
      </div>
      <div>
        <Flex column is='label' width={'55px'}>
          <Box pb={1}>
            <span>CVC</span>
          </Box>
          <CVCInput
            value={cvc}
            onChange={onChange.bind(null, 'cvc')}
            format={determineFormat(type)}
          />
        </Flex>
      </div>
    </Flex>
  </Flex>
)

CreditCardUI.propTypes = { product: PropTypes.array }

const CreditCard = cc({
  propTypes: {
    onUpdate: PropTypes.func,
    styles: PropTypes.shape({
      cardInput: PropTypes.string,
      cardLabel: PropTypes.string,
      expYrInput: PropTypes.string,
      expMoInput: PropTypes.string,
      expLabel: PropTypes.string,
      cvcInput: PropTypes.string,
      cvcLabel: PropTypes.string,
      fieldset: PropTypes.string
    })
  },
  getDefaultProps () {
    return { classStyles: {} }
  },
  getInitialState () {
    return {
      card: { number: '', cvc: '', expMo: 'MM', expYr: 'YY', type: '' }
    }
  },
  onChange (key, value) {
    let newProps = { [key]: value }

    if (key === 'number') {
      newProps.type = determineCCType(value)
    }

    const card = { ...this.state.card, ...newProps }
    this.setState({ card }, () => this.props.onUpdate(this.state.card))
  },
  onSubmit (e) {
    e.preventDefault()
  },
  render () {
    const { onSubmit, onChange, state, props } = this
    const { card: values } = state
    const { styles: style } = props

    return <CreditCardUI {...{ onSubmit, onChange, values, style }} />
  }
})

export default CreditCard
