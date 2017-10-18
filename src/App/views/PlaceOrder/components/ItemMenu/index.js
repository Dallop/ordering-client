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
import QuantityInput from '../QuantityInput'
import { addToOrder } from 'App/views/PlaceOrder/state/order'

const OptionsForm = (
  { formProperties, options, selectedValues = [], onUpdate }
) => {
  const { canPickMany, name, isRequired } = formProperties
  const Group = canPickMany ? CheckboxGroup : RadioGroup
  const Option = canPickMany ? CheckboxOption : RadioOption
  const values = canPickMany ? selectedValues : selectedValues[0]
  const requirementsFulfilled = canPickMany ? values.length : values
  return (
    <Box>
      <Text>
        {name}
        {' '}
        {canPickMany ? '' : '(Choose 1)'}
        {' '}
        <Text error={!requirementsFulfilled} success={requirementsFulfilled}>
          {isRequired ? 'Required' : ''}
        </Text>
      </Text>
      <Group selectedValue={values} onChange={onUpdate} name={name}>
        <Flex wrap>
          {options.map((option, i) => (
            <Box width='48%' mt={1} ml={i % 2 ? '2%' : 0} key={i}>
              <Option value={option.id}>
                <Flex justify='space-between'>
                  <Box>{option.name}</Box>
                  <Box>
                    {option.cost > 0 ? toPrice(option.cost) : '-'}
                  </Box>
                </Flex>
              </Option>
            </Box>
              ))}
        </Flex>
      </Group>
    </Box>
  )
}

/**
 * @prop itemDetails {Object} - menu item object including pricing, description, title, etc.
 * @prop children {Function} - render props function intended to turn rendering control over parent.
 * The function takes this.addToOrder as it's parameter.
 * @prop onSuccessfulAddToOrder {Function} function to run when ItemMenu has validated that all info
 * required to add to an order.
 * @prop optionSetEntities {Object} {1: {id: 1, name: {String}, canPickMany: {Bool}, isRequired: {Bool}, options: {Array}}}
 * @prop optionEntities {Object} {1: {id: 1, name: {String}, cost: {Number}}}
 */
const ItemMenu = connect(({ entities }) => ({
  optionEntities: entities.options,
  optionSetEntities: entities.optionSets
}))(
  cc({
    propTypes: {
      itemDetails: pt.object,
      children: pt.func,
      onSuccessfulAddToOrder: pt.func,
      optionEntities: pt.object,
      optionSetEntities: pt.object
    },
    getInitialState () {
      return {
        quantity: 1,
        instructions: '',
        optionSetValues: {},
        priceVariationIndex: 0,
        showMissingRequirements: false
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
    onOptionSelect (setId, selection) {
      this.setState((prevState, props) => {
        let setValue = {}
        if (props.optionSetEntities[setId].canPickMany) {
          setValue = { [setId]: selection }
        } else {
          // radio option sets should not have more than one value and user should be able to toggle a value "off"
          const previous = prevState.optionSetValues[setId] || []
          setValue = {
            [setId]: previous[0] === selection ? [] : [ selection ]
          }
        }
        return {
          optionSetValues: { ...prevState.optionSetValues, ...setValue }
        }
      })
    },
    getMissingRequirements () {
      const { optionSets } = this.props.itemDetails
      const { optionSetValues } = this.state
      let missingReqs = []
      optionSets.forEach(setId => {
        if (!(optionSetValues[setId] && optionSetValues[setId][0])) {
          missingReqs = [ ...missingReqs, setId ]
        }
      })
      console.log(missingReqs)
      return missingReqs
    },
    getAllSelectedOptions () {
      const { optionSetValues } = this.state
      return Object
        .keys(optionSetValues)
        .reduce(
          (options, optionSetId) => [
            ...options,
            ...optionSetValues[optionSetId]
          ],
          []
        )
    },
    addToOrder () {
      if (this.getMissingRequirements().length) {
        console.log('hi')
        this.setState(() => ({ showMissingRequirements: true }))
      } else {
        this.props.dispatch(
          addToOrder({
            itemMenuId: this.props.itemDetails.id,
            priceVariationIndex: this.state.priceVariationIndex,
            quantity: this.state.quantity,
            instructions: this.state.instructions,
            options: this.getAllSelectedOptions()
          })
        )
        this.props.onSuccessfulAddToOrder()
      }
    },
    setSelectedVariation (priceVariationIndex) {
      this.setState(() => ({ priceVariationIndex }))
    },
    renderPriceVariations () {
      const { priceVariations } = this.props.itemDetails
      const { priceVariationIndex } = this.state
      if (priceVariations.length) {
        return (
          <Box>
            <Text>Select a Variation</Text>
            <RadioGroup
              name='price_variations'
              selectedValue={priceVariationIndex}
              onChange={this.setSelectedVariation}
            >
              {priceVariations.map((variant, i) => (
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
    getOptionsFromSet (setId) {
      const { optionSetEntities, optionEntities } = this.props
      return optionSetEntities[setId].options.map(opId => optionEntities[opId])
    },
    render () {
      const { priceVariationIndex, showMissingRequirements } = this.state
      const { itemDetails } = this.props
      const { name, description, priceVariations, optionSets } = itemDetails
      return (
        <Box position='relative'>
          <Modal
            isOpen={showMissingRequirements}
            onRequestClose={
              () => this.setState({ showMissingRequirements: false })
            }
          >
            {this.getMissingRequirements()}
          </Modal>
          <Box p={3}>
            <Flex justify='space-between'>
              <Title fontSize={4}>{name}</Title>
              <Title fontSize={3}>
                {toPrice(priceVariations[priceVariationIndex].price)}
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
            {optionSets && optionSets.map((setId, i) => (
              <Box mt={2}>
                <OptionsForm
                  key={i}
                  selectedValues={this.state.optionSetValues[setId]}
                  onUpdate={value => this.onOptionSelect(setId, value)}
                  options={this.getOptionsFromSet(setId)}
                  formProperties={this.props.optionSetEntities[setId]}
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
