import { db } from 'config/api'
import { createReducer } from 'state/utils'
export const orgRef = db.collection('orgs')

export const dbRef = db

export const addEntitiesToStore = (entityType, entities) => ({
  type: 'ADD_ENTITIES',
  payload: { entities: { [entityType]: entities } }
})

export const docToEntity = doc => ({ [doc.id]: { id: doc.id, ...doc.data() } })
export const docsToEntities = docs =>
  docs.reduce((entities, doc) => ({ ...entities, ...docToEntity(doc) }), {})

const makeChildEntitiesGetter = (
  { collectionName, parentCollectionName, action }
) =>
  ({ orgId, id, ...rest }) => dispatch => {
    const rootRef = parentCollectionName
      ? orgRef.doc(orgId).collection(parentCollectionName).doc(id)
      : orgRef.doc(orgId)
    rootRef.collection(collectionName).onSnapshot(snapshot => {
      dispatch(
        addEntitiesToStore(collectionName, docsToEntities(snapshot.docs))
      )
      dispatch(
        action({
          id: parentCollectionName ? id : orgId,
          ids: snapshot.docs.map(doc => doc.id)
        })
      )
    })
  }

const makeEntityListReducer = type =>
  createReducer({}, {
    [type]: (state, { payload }) => ({ ...state, [payload.id]: payload.ids })
  })

export const makeEntityDuck = ({ collectionName, parentCollectionName }) => {
  const actionType = `UPDATE_${collectionName.toUpperCase()}`
  const actionCreator = ({ id, ids }) => ({
    type: actionType,
    payload: { id, ids }
  })
  const getter = makeChildEntitiesGetter({
    collectionName,
    parentCollectionName,
    action: actionCreator
  })
  const reducer = makeEntityListReducer(actionType)
  return { actionType, actionCreator, getter, reducer }
}

/**
 * {[name]: {actionType, actionCreator, getter, reducer}}
 */
export const makeEntityDux = parentCollectionName =>
  config =>
    config.reduce(
      (configMap, config) => ({
        ...configMap,
        [config.name]: makeEntityDuck({
          collectionName: config.name,
          parentCollectionName
        })
      }),
      {}
    )
