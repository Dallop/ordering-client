import { createReducer } from 'state/utils'
import { complement } from 'set-manipulator'
let actions = {
  ADD_TO_ORDER: 'ADD_TO_ORDER',
  REMOVE_FROM_ORDER: 'REMOVE_FROM_ORDER'
}

/**
 * @param {Object} payload
 * @param {String} payload.itemMenuId
 * @param {Number} payload.quantity
 * @param {String} payload.instructions
 */
export const addToOrder = payload => ({ type: actions.ADD_TO_ORDER, payload })

/**
 * @param {Number} orderIndex
 */
export const removeFromOrder = orderIndex => ({
  type: actions.REMOVE_FROM_ORDER,
  payload: { orderIndex }
})

export default createReducer([], {
  [actions.ADD_TO_ORDER]: (state, { payload }) => [ ...state, payload ],
  [actions.REMOVE_FROM_ORDER]: (state, { payload }) => [
    ...state.slice(0, payload.orderIndex),
    ...state.slice(payload.orderIndex + 1)
  ]
})

const populate = (ids, entities) => ids.map(id => entities[id])

const flattenMap = map =>
  Object.keys(map).reduce((array, key) => [ ...array, ...map[key] ], [])

const getOrderCosts = ({ locationConfig, order, entities }) => {
  const { menuItems, options } = entities
  const subtotal = order.reduce(
    (total, item) => {
      let itemPrice = menuItems[item.itemMenuId].servingPortions[item.priceVariationIndex].price

      const selections = populate(flattenMap(item.selectionValues), options)

      const selectionCosts = selections.reduce(
        ($, s) => s.cost ? $ + Number(s.cost) : $,
        0
      )
      return (itemPrice + selectionCosts) * item.quantity + total
    },
    0
  )
  const tax = subtotal > 0 ? Number(locationConfig.salesTax) : 0

  const total = subtotal + tax
  return { subtotal, total, tax }
}

/**
 * 1. if options were on by default, we need to get the ones that were de-selected
 * @param selectionMap {Object} - [setId]: [selectedOptionId, selectedOptionId]
 * @return [..., {...setInfo, selectedOptions: [...optionInfo, ...optionInfo]}, ...]
 */
const populateSelections = ({ selectionMap, options, optionSets }) =>
  Object.keys(selectionMap).map(setId => {
    const set = optionSets[setId]
    let selections = selectionMap[setId]

    /* [1] */
    selections = set.optionsAreDefaults
      ? complement(set.options, selections)
      : selections
    selections = selections.map(id => options[id])
    return { ...set, selections }
  })

const getOrderContents = ({ order, entities }) =>
  order.map(item => ({
    ...entities.menuItems[item.itemMenuId],
    ...item,
    selectionSets: populateSelections({
      ...entities,
      selectionMap: item.selectionValues
    })
  }))

export const selectors = { getOrderCosts, getOrderContents }
