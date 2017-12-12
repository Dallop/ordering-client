import { combineReducers } from 'redux'
import { createReducer, mapIdsToEntities, refToId } from 'state/utils'
import { isTakingOrders } from 'App/logic'
import { makeEntityDuck } from 'App/state/utils'

const UPDATE_LOGISTIC_SELECTION = 'UPDATE_LOGISTIC_SELECTION'

const toWeekArray = weekMap => [
  weekMap[0],
  weekMap[1],
  weekMap[2],
  weekMap[3],
  weekMap[4],
  weekMap[5],
  weekMap[6]
]

const getWeekModel = ({ logistics, entities }) =>
  logistics.selections.location &&
    logistics.selections.location.pickUpSchedule.models

export const selectors = {
  isTakingOrders: state => {
    const weekModel = getWeekModel(state)
    if (weekModel) {
      // TODO: make sure this is consistent with location timezone
      const timestamp = new Date()
      return isTakingOrders({
        dayModel: weekModel[timestamp.getDay()],
        timestamp
      })
    }
    return false
  },
  getSelectedLocation: ({ logistics }) => logistics.selections.location,
  getLocationSchedule: getWeekModel,
  getLogisticsOptions: orgId => ({ entities, logistics }) => {
    const locationIds = logistics.locations[orgId]
    const locationEntities = entities.locations
    if (!locationIds || locationEntities.length) {
      return { location: [], method: [], timing: [] }
    }
    const { location } = logistics.selections

    return {
      location: locationIds.map(id => {
        const pickUpSchedule = entities.pickUpSchedules[locationEntities[id].pickUpSchedule]
        return {
          ...locationEntities[id],
          pickUpSchedule: {
            ...pickUpSchedule,
            models: pickUpSchedule ? toWeekArray(pickUpSchedule.models) : []
          }
        }
      }),
      method: location
        ? mapIdsToEntities(
          location.availableMethods.map(refToId),
          entities.orderMethods
        )
        : [],
      timing: location
        ? mapIdsToEntities(
          location.availableTimings.map(refToId),
          entities.orderTiming
        )
        : []
    }
  },
  getLogisticsSelections: state => state.logistics.selections
}

const locations = makeEntityDuck({ collectionName: 'locations' })
export const getLocationEntities = locations.getter

export const updateLogisticSelection = ({ selectionName, value }) => ({
  type: UPDATE_LOGISTIC_SELECTION,
  payload: { key: selectionName, value }
})

const pickUpSchedules = makeEntityDuck({ collectionName: 'pickUpSchedules' })
export const getPickUpSchedules = pickUpSchedules.getter

const selections = createReducer(
  { location: undefined, method: undefined, timing: undefined },
  {
    UPDATE_LOGISTIC_SELECTION: (state, { payload }) => ({
      ...state,
      [payload.key]: payload.value
    })
  }
)

export default combineReducers({
  selections,
  locations: locations.reducer,
  pickUpSchedules: pickUpSchedules.reducer
})
