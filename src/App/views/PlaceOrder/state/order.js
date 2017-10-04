import { createReducer } from 'state/utils'
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

const getOrderCosts = ({ locationConfig, order, entities }) => {
  const subtotal = order.reduce(
    (total, item) => {
      let itemPrice = entities.menuItems[item.itemMenuId].price * item.quantity
      return itemPrice + total
    },
    0
  )
  const tax = subtotal > 0 ? Number(locationConfig.salesTax) : 0

  const total = subtotal + tax
  return { subtotal, total, tax }
}

const getOrderContents = ({ order, entities }) =>
  order.map(item => ({ ...entities.menuItems[item.itemMenuId], ...item }))

export const selectors = { getOrderCosts, getOrderContents }
