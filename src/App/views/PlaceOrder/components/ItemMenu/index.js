import React from 'react'
import cc from 'create-react-class'
import pt from 'prop-types'
import { connect } from 'react-redux'
import { toPrice } from 'utils/rendering'
import {
  Flex,
  Box,
  Input,
  Title,
  Text,
  RadioGroup,
  RadioOption,
  CheckboxGroup,
  CheckboxOption,
  Modal
} from 'App/UI'
import Media from 'react-media'
import QuantityInput from '../QuantityInput'
import { populateOptionSets, getMissingSelectionReqs } from './logic'
import { addToOrder } from 'App/views/PlaceOrder/state/order'

/**
 * TODO: defaults makes a mess of the logic here. simplify it somehow?
 *       probably better to seperate logic?
 */
const OptionSetForm = cc({
  onChange (selectedValues) {
    if (selectedValues.length > this.props.max) return
    this.props.onUpdate(selectedValues)
  },
  render () {
    const {
      name,
      options,
      selectedValues = [],
      optionsAreDefaults: defaults,
      max,
      min
    } = this.props
    const requirementsFulfilled = defaults
      ? true
      : min ? selectedValues.length >= min : false
    const isRequired = defaults ? false : min
    return (
      <Box>
        <Text>
          {name}
          {' '}
          {
            defaults
              ? '(De-Select to Remove)'
              : min && max
                ? `Choose ${min}, & up to ${max}`
                : min ? `Choose ${min}` : max ? `Choose up to ${max}` : ''
          }
          {' '}
          <Text error={!requirementsFulfilled} success={requirementsFulfilled}>
            {isRequired && ' Required'}
          </Text>
        </Text>
        <CheckboxGroup
          selectedValue={selectedValues}
          onChange={this.onChange}
          name={name}
        >
          <Flex wrap>
            {options.map((option, i) => (
              <Media query='(max-width: 499px)' key={i}>
                {matches => {
                  const width = matches ? '100%' : '48%'
                  const ml = matches ? 0 : i % 2 ? '2%' : 0
                  return (
                    <Box width={width} mt={1} ml={ml}>
                      <CheckboxOption value={option.id}>
                        <Flex justify='space-between'>
                          <Box>{option.name}</Box>
                          <Box>
                            {option.cost > 0 ? toPrice(option.cost) : '-'}
                          </Box>
                        </Flex>
                      </CheckboxOption>
                    </Box>
                  )
                }}
              </Media>
              ))}
          </Flex>
        </CheckboxGroup>
      </Box>
    )
  }
})

const MissingReqsModal = ({ reqs, ...rest }) => (
  <Modal {...rest} heading={<Title fontSize={3}>Don't forget:</Title>}>
    <Box px={3} pb={3} pt={1} bg='lightBaseHighlight'>
      <Box is='ul' pt={2}>
        {reqs.map((req, i) => <Box is='li' key={i}>{req.name}</Box>)}
      </Box>
    </Box>
  </Modal>
)

const arrayToMap = (key, array) =>
  array.reduce((map, entity) => ({ ...map, [entity[key]]: entity }), {})
/**
 * @prop itemDetails {Object} - menu item object including pricing, description, title, etc.
 * @prop children {Function} - render props function intended to turn rendering control over parent.
 * The function takes this.addToOrder as it's parameter.
 * @prop onSuccessfulAddToOrder {Function} function to run when ItemMenu has validated that all info
 * required to add to an order.
 * @prop optionSets {Array} [{id: 1, name: String, canPickMany: Bool, isRequired: Bool, options: [option]}]
 * @prop optionSetMap {Object} {[optionSetId]: optionSet}
 */
const ItemMenu = connect(({ entities }, props) => {
  let optionSets = []
  let optionSetMap = {}
  if (props.itemDetails.optionSets) {
    optionSets = populateOptionSets({
      optionSetIds: props.itemDetails.optionSets,
      ...entities
    })
    optionSetMap = arrayToMap('id', optionSets)
  }
  return { optionSets, optionSetMap }
})(
  cc({
    propTypes: {
      itemDetails: pt.object,
      children: pt.func,
      onSuccessfulAddToOrder: pt.func,
      optionSets: pt.array
    },
    getDefaultSelectionValues () {
      let selectionValues = {}
      this.props.optionSets.forEach(set => {
        if (set.optionsAreDefaults) {
          selectionValues[set.id] = set.options.map(op => op.id)
        }
      })
      return selectionValues
    },
    getInitialState () {
      return {
        quantity: 1,
        instructions: '',
        selectionValues: this.getDefaultSelectionValues(),
        priceVariationIndex: 0,
        showMissingSelectionReqs: false
      }
    },
    onQuantityChange (newQuantity) {
      this.setState(() => ({ quantity: newQuantity }))
    },
    onInstructionChange (value) {
      this.setState(() => ({ instructions: value }))
    },
    /**
     * { [setId]: [optionId]}
     */
    onOptionSelect (setId, selections) {
      this.setState(prev => ({
        selectionValues: { ...prev.selectionValues, [setId]: selections }
      }))
    },
    addToOrder () {
      if (getMissingSelectionReqs(this.state, this.props).length) {
        this.setState(() => ({ showMissingSelectionReqs: true }))
      } else {
        const {
          selectionValues,
          quantity,
          instructions,
          priceVariationIndex
        } = this.state
        this.props.dispatch(
          addToOrder({
            itemMenuId: this.props.itemDetails.id,
            priceVariationIndex,
            quantity,
            instructions,
            selectionValues
          })
        )
        this.props.onSuccessfulAddToOrder()
      }
    },
    setSelectedVariation (priceVariationIndex) {
      this.setState(() => ({ priceVariationIndex }))
    },
    renderPriceVariations () {
      const { servingPortions } = this.props.itemDetails
      const { priceVariationIndex } = this.state
      if (servingPortions.length > 1) {
        return (
          <Box>
            <Text>Select a Variation</Text>
            <RadioGroup
              name='price_variations'
              selectedValue={priceVariationIndex}
              onChange={this.setSelectedVariation}
            >
              {servingPortions.map((variant, i) => (
                <Box key={i} mt={1}>
                  <RadioOption
                    value={i}
                    children={(
                      <Flex justify='space-between'>
                        <Box>{variant.name}</Box>
                        <Box>{toPrice(variant.price)}</Box>
                      </Flex>
                        )}
                    />
                </Box>
                ))}
            </RadioGroup>
          </Box>
        )
      }
    },
    render () {
      const {
        selectionValues,
        priceVariationIndex,
        showMissingSelectionReqs
      } = this.state
      const { itemDetails, optionSets } = this.props
      const { name, description, servingPortions } = itemDetails
      return (
        <Box position='relative'>
          {
            showMissingSelectionReqs &&
              (
                <MissingReqsModal
                  isOpen={showMissingSelectionReqs}
                  onRequestClose={
                    () => this.setState({ showMissingSelectionReqs: false })
                  }
                  reqs={getMissingSelectionReqs(this.state, this.props)}
                />
              )
          }
          <Box p={3}>
            <Flex justify='space-between'>
              <Title fontSize={4}>{name}</Title>
              <Title fontSize={3}>
                {toPrice(servingPortions[priceVariationIndex].price)}
              </Title>
            </Flex>
            <Box py={2}>
              <Text is='p'>{description}</Text>
            </Box>
            {this.renderPriceVariations()}
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
            {optionSets && optionSets.map((set, i) => (
              <Box mt={2}>
                <OptionSetForm
                  key={i}
                  selectedValues={selectionValues[set.id]}
                  onUpdate={value => this.onOptionSelect(set.id, value)}
                  {...set}
                    />
              </Box>
                ))}
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
          {this.props.children(this.addToOrder)}
        </Box>
      )
    }
  })
)

export default ItemMenu
