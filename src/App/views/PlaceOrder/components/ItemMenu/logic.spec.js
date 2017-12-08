import { populateOptionSets, getMissingSelectionReqs } from './logic'

test(
  'turn an array of optionSet ids into an array of optionSet objects complete with options properties with options objects',
  () => {
    const optionSetIds = [ 1, 2, 3 ]
    const optionSets = {
      1: { id: 1, options: [ 1, 2, 3 ] },
      2: { id: 2, options: [ 4, 5 ] },
      3: { id: 3, options: [ 6 ] }
    }
    const options = {
      1: { id: 1 },
      2: { id: 2 },
      3: { id: 3 },
      4: { id: 4 },
      5: { id: 5 },
      6: { id: 6 }
    }
    expect(
      populateOptionSets({ optionSetIds, options, optionSets })
    ).toEqual([ { id: 1, options: [ { id: 1 }, { id: 2 }, { id: 3 } ] }, { id: 2, options: [ { id: 4 }, { id: 5 } ] }, { id: 3, options: [ { id: 6 } ] } ])
  }
)

describe('validate option sets', () => {
  test('catches set that violates minimum requirement of 1', () => {
    const optionSets = [ { id: '1', min: 1 } ]
    const selectionValues = {}
    const missingReq = getMissingSelectionReqs({ selectionValues }, {
      optionSets
    })

    expect(missingReq).toEqual([ optionSets[0] ])
  })

  test('catches set that violates minimum requirement of 2 or more', () => {
    const optionSets = [ { id: '1', min: 2 } ]
    const selectionValues = { 1: [ 'optionId' ] }
    const missingReq = getMissingSelectionReqs({ selectionValues }, {
      optionSets
    })

    expect(missingReq).toEqual([ optionSets[0] ])
  })
})
