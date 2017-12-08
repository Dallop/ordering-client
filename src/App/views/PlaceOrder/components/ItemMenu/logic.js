export const populateOptionSets = ({ optionSetIds, optionSets, options }) =>
  optionSetIds.map(setId => {
    const set = optionSets[setId]
    return { ...set, options: set.options.map(opId => options[opId]) }
  })

export const getMissingSelectionReqs = ({ selectionValues }, { optionSets }) => {
  if (!optionSets) return
  let missingReqs = []
  optionSets.forEach(set => {
    const setValues = selectionValues[set.id] || []
    if (set.min && setValues.length < set.min) {
      missingReqs = [ ...missingReqs, set ]
    }
  })
  return missingReqs
}
