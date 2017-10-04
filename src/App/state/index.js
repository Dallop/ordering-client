import { combineReducers } from 'redux'
import { createReducer } from 'state/utils'

export const CALL_API = 'CALL_API'

export const callApi = config => ({ [CALL_API]: config })

const initialEntityState = {
  menuItems: {
    1: {
      id: 1,
      name: 'Burrito Supremo',
      description: 'This guy is the super delicious of your dreams.',
      price: 8.5
    },
    2: {
      id: 2,
      name: 'Burrito Excellente',
      description: 'Fill three crispy corn shells with your choice of meat or sofritas, salsa, guacamole, sour cream or cheese, and romaine lettuce.',
      price: 9
    },
    3: {
      id: 3,
      name: 'Burrito Caliente',
      description: 'This guy is the super caliente of your dreams.',
      price: 11.5
    },
    4: {
      id: 4,
      name: 'Chicken Taco',
      description: 'I love chicken so we put it in your tacos',
      price: 3.5
    },
    5: {
      id: 5,
      name: 'Pork Taco',
      description: 'I love pork so we put it in your tacos',
      price: 4
    }
  }
}
const createReducerFn = name =>
  (state = initialEntityState[name], { payload }) =>
    payload && payload.entities && payload.entities[name]
      ? { ...state, ...payload.entities[name] }
      : state

const entities = combineReducers({ menuItems: createReducerFn('menuItems') })

const PHASE_FORWARD = 'PHASE_FORWARD'
const PHASE_BACK = 'PHASE_BACK'
const orderPhase = createReducer(2, {
  [PHASE_FORWARD]: state => state + 1,
  [PHASE_BACK]: state => state - 1
})

export const phaseForward = () => ({ type: PHASE_FORWARD })
export const phaseBack = () => ({ type: PHASE_BACK })

export default combineReducers({
  orderPhaseIndex: orderPhase,
  entities,
  order: require('App/views/PlaceOrder/state/order').default,
  locationConfig: createReducer({ salesTax: '.90' }, {})
})
