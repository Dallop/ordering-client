import React from 'react'
import { connect } from 'react-redux'
import cc from 'create-react-class'
import pt from 'prop-types'
import { Box, Flex, Title, settings, Button } from 'App/UI'
import { phaseForward } from 'App/state'
import { updateLogisticSelection, selectors } from 'App/state/logistics'
import ScheduleModal from './components/ScheduleModal'
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

const PickUpNowSelectionOption = connect(state => ({
  available: selectors.isTakingOrders(state),
  location: selectors.getSelectedLocation(state),
  scheduleModel: selectors.getLocationSchedule(state)
}))(
  cc({
    propTypes: { available: pt.bool },
    getInitialState () {
      return { showAvailability: false }
    },
    showAvailability () {
      this.setState(() => ({ showAvailability: true }))
    },
    hideAvailability () {
      this.setState(() => ({ showAvailability: false }))
    },
    render () {
      const { available, onClick, ...rest } = this.props
      return (
        <SelectionOption
          {...rest}
          title={`Order for Now ${available ? '' : '(Unavailable)'}`}
          onClick={available ? onClick : this.showAvailability}
        >
          We'll prepare your order as soon as possible
          <ScheduleModal
            isOpen={this.state.showAvailability}
            location={this.props.location}
            onRequestClose={this.hideAvailability}
          />
        </SelectionOption>
      )
    }
  })
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
    heading,
    OptionComponent
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
          <OptionComponent
            key={i}
            title={op.title}
            onClick={op.onClick || onSelect.bind(null, op.value)}
                >
            {op.description}
          </OptionComponent>
              ))}
      </Box>
    </Box>
  )
}

const Logistics = cc({
  propTypes: {
    onConfirmation: pt.func,
    options: pt.shape({
      location: pt.array.isRequired,
      method: pt.array.isRequired,
      timing: pt.array.isRequired
    })
  },
  onConfirm () {
    this.props.onConfirmation()
  },
  setSelection (key, value) {
    this.props.setSelection({ selectionName: key, value })
  },
  resetSelection (menuIndex) {
    selectionConfig.order
      .slice(menuIndex)
      .forEach(selectionType => this.setSelection(selectionType, undefined))
  },
  readyForConfirmation () {
    const { location, timing, method } = this.props.selections
    return location && timing && method
  },
  render () {
    const { selections } = this.props

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
                mapToMenuOption,
                OptionComponent
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
                OptionComponent={OptionComponent}
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

export default connect(({ logistics }) => ({ ...logistics }), dispatch => ({
  onConfirmation: () => dispatch(phaseForward()),
  setSelection: params => dispatch(updateLogisticSelection(params))
}))(Logistics)

const mapTimingTypeToValues = { NOW: { title: `Order for Now` } }

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
    mapToMenuOption: l => ({
      value: l,
      title: l.title,
      description: l.address
    }),
    OptionComponent: SelectionOption
  },
  timing: {
    Icon: require('App/UI').Time,
    getHeading: value =>
      value && mapTimingTypeToValues[value].title || 'Choose a Time',
    mapToMenuOption: t => ({ value: t.type }),
    OptionComponent: PickUpNowSelectionOption
  },
  method: {
    Icon: require('App/UI').ShoppingBag,
    getHeading: value =>
      value && mapMethodTypeToValues[value].title || 'Choose a Method',
    mapToMenuOption: m => ({
      value: m.type,
      title: mapMethodTypeToValues[m.type].title,
      description: mapMethodTypeToValues[m.type].description
    }),
    OptionComponent: SelectionOption
  }
}
