import { combineReducers } from 'redux'
import { createReducer } from 'state/utils'
import { isTakingOrders } from 'App/logic'
import week from './dummy-data'

const UPDATE_LOGISTIC_SELECTION = 'UPDATE_LOGISTIC_SELECTION'

const getWeekModel = ({ logistics }) =>
  logistics.selections.location &&
    logistics.selections.location.availability.weekModel

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
  getSelectedLocation: ({ logistics }) =>
    logistics.selections.location ||
      {
        id: 1,
        title: 'Orem MidiCi',
        address: '541 E University Pkwy, UT 84097',
        availability: { weekModel: week.location1 }
      },
  getLocationSchedule: getWeekModel
}

export const updateLogisticSelection = ({ selectionName, value }) => ({
  type: UPDATE_LOGISTIC_SELECTION,
  payload: { key: selectionName, value }
})

const selections = createReducer(
  { location: undefined, method: undefined, timing: undefined },
  {
    UPDATE_LOGISTIC_SELECTION: (state, { payload }) => ({
      ...state,
      [payload.key]: payload.value
    })
  }
)

const options = createReducer(
  {
    location: [
      {
        id: 1,
        title: 'Orem MidiCi',
        address: '541 E University Pkwy, UT 84097',
        availability: { weekModel: week.location1 }
      },
      {
        id: 2,
        title: 'American Fork MidiCi',
        address: '1723 E Main St. American Fork, UT 84003',
        availability: { weekModel: week.location2 }
      }
    ],
    method: [ { type: 'PICK_UP', label: 'Pick Up' } ],
    timing: [ { type: 'NOW', label: 'Order for Now' } ]
  },
  { UPDATE_LOGISTICS: () => ({}) }
)

export default combineReducers({ selections, options })
