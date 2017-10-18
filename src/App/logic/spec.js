// available 9:00am - 11:30
const dayModel = [
  // 12:00 - 12:15 (am)
  0,
  // 12:15 - 12:30 (am)
  0,
  // 12:30 - 12:45 (am)
  0,
  // 12:45 - 1:00 (am)
  0,
  // 1:00 - 1:15 (am)
  0,
  // 1:15 - 1:30 (am)
  0,
  // 1:30 - 1:45 (am)
  0,
  // 1:45 - 2:00 (am)
  0,
  // 2:00 - 2:15 (am)
  0,
  // 2:15 - 2:30 (am)
  0,
  // 2:30 - 2:45 (am)
  0,
  // 2:45 - 3:00 (am)
  0,
  // 3:00 - 3:15 (am)
  0,
  // 3:15 - 3:30 (am)
  0,
  // 3:30 - 3:45 (am)
  0,
  // 3:45 - 4:00 (am)
  0,
  // 4:00 - 4:15 (am)
  0,
  // 4:15 - 4:30 (am)
  0,
  // 4:30 - 4:45 (am)
  0,
  // 4:45 - 5:00 (am)
  0,
  // 5:00 - 5:15 (am)
  0,
  // 5:15 - 5:30 (am)
  0,
  // 5:30 - 5:45 (am)
  0,
  // 5:45 - 6:00 (am)
  0,
  // 6:00 - 6:15 (am)
  0,
  // 6:15 - 6:30 (am)
  0,
  // 6:30 - 6:45 (am)
  0,
  // 6:45 - 7:00 (am)
  0,
  // 7:00 - 7:15 (am)
  0,
  // 7:15 - 7:30 (am)
  0,
  // 7:30 - 7:45 (am)
  0,
  // 7:45 - 8:00 (am)
  0,
  // 8:00 - 8:15 (am)
  0,
  // 8:15 - 8:30 (am)
  0,
  // 8:30 - 8:45 (am)
  0,
  // 8:45 - 9:00 (am)
  0,
  // 9:00 - 9:15 (am)
  1,
  // 9:15 - 9:30 (am)
  1,
  // 9:30 - 9:45 (am)
  1,
  // 9:45 - 10:00 (am)
  1,
  // 10:00 - 10:15 (am)
  1,
  // 10:15 - 10:30 (am)
  1,
  // 10:30 - 10:45 (am)
  1,
  // 10:45 - 11:00 (am)
  1,
  // 11:00 - 11:15 (am)
  1,
  // 11:15 - 11:30 (am)
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
]

import {
  createNewDay,
  createTimestamp,
  stampToIndex,
  addAvailability,
  isTakingOrders,
  indexToTimeString,
  dayModelToString
} from './index'

test(
  'creates array representing a day broken into 96 15 minute segments',
  () => {
    expect(createNewDay().length).toBe(96)
  }
)

test(
  'converts date objects to correct corresponding day time index value',
  () => {
    expect(stampToIndex(new Date('2000-01-01 12:00 AM'))).toBe(0)
    expect(stampToIndex(new Date('2000-01-01 12:00 PM'))).toBe(48)
  }
)

test('adds correct availability to day data model', () => {
  const newDay = addAvailability({
    startStamp: createTimestamp({ hour: 9, minute: '00', meridiem: 'AM' }),
    endStamp: createTimestamp({ hour: 11, minute: 30, meridiem: 'AM' }),
    day: createNewDay()
  })
  expect(newDay.length).toBe(96)
  expect(newDay).toEqual(dayModel)
})

test('does not take orders right before start time', () => {
  expect(
    isTakingOrders({ dayModel, timestamp: new Date('2000-01-01 8:59 AM') })
  ).toBe(false)
})

test('takes orders at the exact start time', () => {
  expect(
    isTakingOrders({ dayModel, timestamp: new Date('2000-01-01 9:00 AM') })
  ).toBe(true)
})

test('takes orders at times between start and end time', () => {
  for (let i = 0; i < 60; i++) {
    expect(
      isTakingOrders({
        dayModel,
        timestamp: createTimestamp({ hour: 9, minute: i, meridiem: 'AM' })
      })
    ).toBe(true)
  }

  for (let i = 0; i < 60; i++) {
    expect(
      isTakingOrders({
        dayModel,
        timestamp: createTimestamp({ hour: 10, minute: i, meridiem: 'AM' })
      })
    ).toBe(true)
  }

  for (let i = 0; i < 30; i++) {
    expect(
      isTakingOrders({
        dayModel,
        timestamp: createTimestamp({ hour: 11, minute: i, meridiem: 'AM' })
      })
    ).toBe(true)
  }
})

test('take orders exactly at end time?', () => {
  expect(
    isTakingOrders({ dayModel, timestamp: new Date('2000-01-01 11:30 AM') })
  ).toBe(false)
})

test('does not take orders 1 minute after end time', () => {
  expect(
    isTakingOrders({ dayModel, timestamp: new Date('2000-01-01 11:31 AM') })
  ).toBe(false)
})

test('for a given index, the time is correctly given back', () => {
  expect(indexToTimeString(5)).toEqual('1:15 am')
  expect(indexToTimeString(36)).toBe('9:00 am')
  expect(indexToTimeString(48)).toBe('12:00 pm')
  expect(indexToTimeString(52)).toBe('1:00 pm')
})

test(
  'for a given day model with _no_ availability, a data structure containing an empty array is returned',
  () => {
    // no availability
    expect(dayModelToString(createNewDay())).toEqual([])
  }
)
test(
  'for a given day model with _one_ availability period, a data structure containing a string representation of availability is returned',
  () => {
    // single availability
    expect(dayModelToString(dayModel)).toEqual([ '9:00 am - 11:30 am' ])
  }
)
test(
  'for a given day model with _multiple_ availability periods, a data structure containing a string representation of availability is returned',
  () => {
    // complex availability
    const complexDayModel = addAvailability({
      day: dayModel,
      startStamp: createTimestamp({ hour: 2, minute: 0, meridiem: 'PM' }),
      endStamp: createTimestamp({ hour: 8, minute: 0, meridiem: 'PM' })
    })

    expect(
      dayModelToString(complexDayModel)
    ).toEqual([ '9:00 am - 11:30 am', '2:00 pm - 8:00 pm' ])
  }
)
