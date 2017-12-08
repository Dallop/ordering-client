import { combineReducers } from 'redux'
import { createReducer } from 'state/utils'
import {
  dbRef,
  orgRef,
  addEntitiesToStore,
  docToEntity,
  docsToEntities
} from './utils'

const entityNames = [
  'orgs',
  'locations',
  'menus',
  'categories',
  'optionSets',
  'options',
  'menuItems',
  'orderMethods',
  'orderTiming',
  'pickUpSchedules'
]

const initialEntityState = entityNames.reduce(
  (state, entity) => ({ ...state, [entity]: {} }),
  {}
)

const createReducerFn = name =>
  (state = initialEntityState[name], { payload }) =>
    payload && payload.entities && payload.entities[name]
      ? { ...state, ...payload.entities[name] }
      : state

const entities = combineReducers(
  entityNames.reduce(
    (state, entity) => ({ ...state, [entity]: createReducerFn(entity) }),
    {}
  )
)

const settingsRef = dbRef.collection('settings').doc('primary')
export const getSettings = () => dispatch => {
  settingsRef
    .collection('orderMethods')
    .get()
    .then(
      snapshot =>
        dispatch(
          addEntitiesToStore('orderMethods', docsToEntities(snapshot.docs))
        )
    )
  settingsRef
    .collection('orderTiming')
    .get()
    .then(
      snapshot =>
        dispatch(
          addEntitiesToStore('orderTiming', docsToEntities(snapshot.docs))
        )
    )
}

export const getOrgData = id => dispatch => {
  orgRef
    .doc(id)
    .onSnapshot(doc => dispatch(addEntitiesToStore('orgs', docToEntity(doc))))
  orgRef
    .doc(id)
    .collection('locations')
    .onSnapshot(
      snapshot =>
        dispatch(addEntitiesToStore('orgs', docToEntity(snapshot.docs)))
    )
  orgRef
    .doc(id)
    .collection('menus')
    .onSnapshot(
      snapshot =>
        dispatch(addEntitiesToStore('menus', docToEntity(snapshot.docs)))
    )
}

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
  ),
  ...require('./Logistics').default,
  ...require('App/views/PlaceOrder/state').default
})
