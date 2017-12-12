import firebase from 'firebase'
import 'firebase/firestore'
import configureMiddleware from 'redux-firestore-middleware'

firebase.initializeApp({
  apiKey: 'AIzaSyA2tuaFSWaaura4F7L7KPPPueP4W9PxBrc',
  authDomain: 'boostly-84933.firebaseapp.com',
  projectId: 'boostly-84933'
})

export const auth = firebase.auth()

const CALL_STORE = 'CALL_STORE'
export const callStore = config => ({ [CALL_STORE]: { ...config } })

const firestoreInstance = firebase.firestore()

export const db = firestoreInstance
export default configureMiddleware({
  firestoreInstance,
  MIDDLEWARE_FLAG: CALL_STORE
})
