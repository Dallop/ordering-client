import React from 'react'
import { connect } from 'react-redux'
import cc from 'create-react-class'
import pt from 'prop-types'
import { Box, Flex, Title, settings, Button } from 'App/UI'
import { phaseForward } from 'App/state'
import { selectors } from './state'
const { colors: clr } = settings

/**
 * There are three states a SelectionMenu can have
 * 1) awaiting - This is awaiting a selection to be made, even if there is only one option.
 *   This means SelectionMenus before this one have not had a selection made either.
 * 2) active - A SelectionMenu with this state is actively having a selection made on it.
 * 3) complete - A selection has been made on this and all previous SelectionMenus
 */
const SelectionMenuAccordion = ({ children, values, dontRenderAwaiting }) => {
  return (
    <div>
      {React.Children.map(children, (Child, i) => {
        if (i === 0) {
          return React.cloneElement(Child, {
            state: values[0] ? 'complete' : 'active'
          })
        } else {
          if (dontRenderAwaiting && priorValuesMissing(i, values)) return
          return React.cloneElement(Child, {
              // awaiting === one of the previous SelectionMenus doesn't have a value
              // otherwise if this SelectionMenu has a value it's complete
              // if this SelectionMenu doesn't have a value (&& all previous do) it's active
            state: priorValuesMissing(i, values)
                ? 'awaiting'
                : values[i] ? 'complete' : 'active'
          })
        }
      })}
    </div>
  )
  function priorValuesMissing (index, vals) {
    return vals.slice(0, index).some(val => !val)
  }
}

const SelectionMenuHeading = ({ Icon, children, isActive, onClick }) => (
  <Flex
    align='center'
    bg={isActive ? clr.darkBase : clr.base}
    transition='.1s'
    py={2}
    onClick={onClick}
    borderBottom={`solid 2px ${clr.baseBorder}`}
  >
    <Flex w='70px' justify='center'>
      <Icon color={isActive ? clr.textOnDark : clr.textOnLight} />
    </Flex>
    <Box>
      <Title onDark={isActive} fontSize={3}>{children}</Title>
    </Box>
  </Flex>
)

const SelectionOption = ({ title, children, onClick }) => (
  <Flex
    align='center'
    onClick={onClick}
    py={2}
    borderBottom={`solid 2px ${clr.lightBaseBorder}`}
    cursor='pointer'
    backgroundColor={clr.lightBase}
    hover={{ backgroundColor: clr.lightBaseHighlight }}
    transition='.25s'
  >
    <Box pl='70px'>
      <Title>{title}</Title>
      <Box>{children}</Box>
    </Box>
  </Flex>
)

// state: awaiting, active, complete
// if one value: skip || explicit select
const SelectionMenu = (
  {
    Icon,
    options = [],
    state = 'awaiting',
    onSelect = _ => _,
    onOpenRequest,
    heading
  }
) => {
  return (
    <Box transition='.25s'>
      <Box cursor={state === 'completed' ? 'pointer' : 'default'}>
        <SelectionMenuHeading
          Icon={Icon}
          onClick={onOpenRequest}
          isActive={state === 'active'}
          >
          {heading}
        </SelectionMenuHeading>
      </Box>
      <Box>
        {state === 'active' && options.map((op, i) => (
          <SelectionOption
            key={i}
            title={op.title}
            onClick={onSelect.bind(null, op.value)}
                >
            {op.description}
          </SelectionOption>
              ))}
      </Box>
    </Box>
  )
}

const Logistics = cc({
  /**
   * @desc if there is only one selection option we want to set that as the value, otherwise
   * we'll want to get the value from the user.
   */
  getInitialState () {
    const { options } = this.props
    return {
      selections: {
        ...selectionConfig.order.reduce(
          (initialState, optionName) => ({
            ...initialState,
            [optionName]: options[optionName].length > 1
              ? undefined
              : options[0]
          }),
          {}
        )
      }
    }
  },
  propTypes: {
    onConfirmation: pt.func,
    options: pt.shape({
      location: pt.array.isRequired,
      method: pt.array.isRequired,
      timing: pt.array.isRequired
    })
  },
  onConfirm () {
    // TODO: do something with selection values
    this.props.onConfirmation()
  },
  setSelection (key, value) {
    this.setState(prev => ({
      selections: { ...prev.selections, [key]: value }
    }))
  },
  resetSelection (menuIndex) {
    selectionConfig.order
      .slice(menuIndex)
      .forEach(selectionType => this.setSelection(selectionType, undefined))
  },
  readyForConfirmation () {
    const { location, timing, method } = this.state.selections
    return location && timing && method
  },
  render () {
    const { selections } = this.state

    return (
      <Box>
        <SelectionMenuAccordion
          values={selectionConfig.order.map(type => selections[type])}
          dontRenderAwaiting
        >
          {selectionConfig.order.map((type, i) => {
            const {
                Icon,
                getHeading,
                mapToMenuOption
              } = selectionConfig[type]
            const selection = selections[type]
            return (
              <SelectionMenu
                key={i}
                Icon={Icon}
                heading={getHeading(selection)}
                onSelect={this.setSelection.bind(null, type)}
                options={this.props.options[type].map(mapToMenuOption)}
                onOpenRequest={() => this.resetSelection(i)}
                />
            )
          })}
        </SelectionMenuAccordion>
        <Box p={2}>
          {this.readyForConfirmation() && (
          <Button onClick={this.onConfirm}>
                  Confirm & View Menu
                </Button>
              )}
        </Box>
      </Box>
    )
  }
})

export default connect(
  state => ({ options: selectors.getLogistics(state) }),
  dispatch => ({ onConfirmation: () => dispatch(phaseForward()) })
)(Logistics)

const mapTimingTypeToValues = {
  NOW: {
    title: 'Order for Now',
    description: "We'll prepare your order as soon as possible"
  }
}
const mapMethodTypeToValues = {
  PICK_UP: {
    title: 'Pick Up',
    description: 'Pick up your order your selected location'
  }
}

const selectionConfig = {
  order: [ 'location', 'timing', 'method' ],
  location: {
    Icon: require('App/UI').Place,
    getHeading: value => value && value.title || 'Choose a Location',
    mapToMenuOption: l => ({ value: l, title: l.title, description: l.address })
  },
  timing: {
    Icon: require('App/UI').Time,
    getHeading: value =>
      value && mapTimingTypeToValues[value].title || 'Choose a Time',
    mapToMenuOption: t => ({
      value: t.type,
      title: mapTimingTypeToValues[t.type].title,
      description: mapTimingTypeToValues[t.type].description
    })
  },
  method: {
    Icon: require('App/UI').ShoppingBag,
    getHeading: value =>
      value && mapMethodTypeToValues[value].title || 'Choose a Method',
    mapToMenuOption: m => ({
      value: m.type,
      title: mapMethodTypeToValues[m.type].title,
      description: mapMethodTypeToValues[m.type].description
    })
  }
}
