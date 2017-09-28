import { combineReducers } from 'redux'

export const CALL_API = 'CALL_API'

export const callApi = config => ({ [CALL_API]: config })

const initialEntityState = {
  users: {
    1: {
      email: 'mikey@trace.com',
      firstName: 'Mikey',
      lastName: 'Murphy',
      id: 1
    }
  }
}
const createReducerFn = name =>
  (state = initialEntityState[name], { payload }) =>
    console.log(payload) ||
      payload && payload.entities && payload.entities[name]
      ? { ...state, ...payload.entities[name] }
      : state

const entities = combineReducers({ users: createReducerFn('users') })

export default combineReducers({ entities })
