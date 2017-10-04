import { createReducer } from 'state/utils'

const getLogistics = () => ({
  location: [
    { id: 1, title: 'Orem MidiCi', address: '541 E University Pkwy, UT 84097' },
    {
      id: 2,
      title: 'American Fork MidiCi',
      address: '1723 E Main St. American Fork, UT 84003'
    }
  ],
  method: [ { type: 'PICK_UP', label: 'Pick Up' } ],
  timing: [ { type: 'NOW', label: 'Order for Now' } ]
})
export const selectors = { getLogistics }

export default createReducer(
  {
    location: [
      {
        id: 1,
        title: 'Orem MidiCi',
        address: '541 E University Pkwy, UT 84097'
      },
      {
        id: 2,
        title: 'American Fork MidiCi',
        address: '1723 E Main St. American Fork, UT 84003'
      }
    ],
    method: [ { type: 'PICK_UP', label: 'Pick Up' } ],
    timing: [ { type: 'NOW', label: 'Order for Now' } ]
  },
  { UPDATE_LOGISTICS: () => ({}) }
)
