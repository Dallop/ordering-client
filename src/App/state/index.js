import { combineReducers } from 'redux'
import { createReducer } from 'state/utils'

export const CALL_API = 'CALL_API'

export const callApi = config => ({ [CALL_API]: config })

const initialEntityState = {
  menuCategories: [
    { name: 'Burritos', items: [ 1, 2, 3 ] },
    { name: 'Tacos', items: [ 4, 5 ] }
  ],
  options: {
    1: { id: 1, name: 'Pansy Waist', cost: 0 },
    2: { id: 2, name: 'Mild Manor', cost: 0 },
    3: { id: 3, name: 'Tingly Tonya', cost: 3 },
    4: { id: 4, name: 'Hotter than sun', cost: 6 },
    5: { id: 5, name: 'Sour Cream', cost: 1 },
    6: { id: 6, name: 'Steak', cost: 2 },
    7: { id: 7, name: 'Chicken', cost: 0 },
    8: { id: 8, name: 'Guacamole', cost: 1 },
    9: { id: 9, name: 'Extra Cheese', cost: 0.5 },
    10: { id: 10, name: 'Peppers', cost: 0 },
    11: { id: 11, name: 'Olives', cost: 0 },
    12: { id: 12, name: 'Refried Beans', cost: 0 },
    13: { id: 13, name: 'Lettuce', cost: 0 },
    14: { id: 14, name: 'Lime Juice', cost: 0 }
  },
  optionSets: {
    1: {
      name: 'Hot Sauce',
      isRequired: true,
      canPickMany: false,
      options: [ 1, 2, 3, 4 ]
    },
    2: {
      name: 'Additions',
      isRequired: true,
      canPickMany: true,
      options: [ 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ]
    }
  },
  menuItems: {
    1: {
      id: 1,
      name: 'Burrito Supremo',
      description: 'This guy is the super delicious of your dreams.',
      optionSets: [ 1, 2 ],
      priceVariations: [
        { name: 'Peque\xF1o', price: 8.5 },
        { name: 'Grande', price: 11 }
      ]
    },
    2: {
      id: 2,
      name: 'Burrito Excellente',
      description: 'Fill three crispy corn shells with your choice of meat or sofritas, salsa, guacamole, sour cream or cheese, and romaine lettuce.',
      priceVariations: [
        { name: 'Small', price: 7 },
        { name: 'Medium', price: 9 },
        { name: 'Large', price: 12 }
      ]
    },
    3: {
      id: 3,
      name: 'Burrito Caliente',
      description: 'This guy is the super caliente of your dreams.',
      priceVariations: [ { name: 'default', price: 11.5 } ]
    },
    4: {
      id: 4,
      name: 'Chicken Taco',
      description: 'I love chicken so we put it in your tacos',
      priceVariations: [ { name: 'default', price: 3.5 } ]
    },
    5: {
      id: 5,
      name: 'Pork Taco',
      description: 'I love pork so we put it in your tacos',
      priceVariations: [ { name: 'default', price: 4 } ]
    }
  }
}

const createReducerFn = name =>
  (state = initialEntityState[name], { payload }) =>
    payload && payload.entities && payload.entities[name]
      ? { ...state, ...payload.entities[name] }
      : state

const entities = combineReducers({
  menuItems: createReducerFn('menuItems'),
  menuCategories: createReducerFn('menuCategories'),
  optionSets: createReducerFn('optionSets'),
  options: createReducerFn('options')
})

const PHASE_FORWARD = 'PHASE_FORWARD'
const PHASE_BACK = 'PHASE_BACK'
const GO_TO_PHASE = 'GO_TO_PHASE'
const orderPhase = createReducer(1, {
  [PHASE_FORWARD]: state => state + 1,
  [PHASE_BACK]: state => state - 1,
  [GO_TO_PHASE]: (state, { payload }) => payload
})

export const phaseForward = () => ({ type: PHASE_FORWARD })
export const phaseBack = () => ({ type: PHASE_BACK })
export const goToPhase = phaseIndex => ({
  type: GO_TO_PHASE,
  payload: phaseIndex
})

export default combineReducers({
  orderPhaseIndex: orderPhase,
  entities,
  order: require('App/views/PlaceOrder/state/order').default,
  logistics: require('./logistics').default,
  locationConfig: createReducer(
    { salesTax: '.90', defaultWait: 15, minimumOrderValue: 5 },
    {}
  )
})
