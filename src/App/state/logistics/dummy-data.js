import { createNewDay, addAvailability, createTimestamp } from 'App/logic'

const blankDay = createNewDay()

const common = addAvailability({
  day: blankDay,
  startStamp: createTimestamp({ hour: 10, minute: 0, meridiem: 'AM' }),
  endStamp: createTimestamp({ hour: 11, minute: 30, meridiem: 'AM' })
})
const weekDay = addAvailability({
  day: common,
  startStamp: createTimestamp({ hour: 2, minute: 0, meridiem: 'PM' }),
  endStamp: createTimestamp({ hour: 8, minute: 0, meridiem: 'PM' })
})
const weekend = addAvailability({
  day: common,
  startStamp: createTimestamp({ hour: 11, minute: 30, meridiem: 'AM' }),
  endStamp: createTimestamp({ hour: 4, minute: 0, meridiem: 'PM' })
})

export default {
  location1: [ weekend, weekDay, weekDay, weekDay, weekDay, weekDay, weekend ],
  location2: [ blankDay, weekDay, weekDay, weekDay, weekDay, weekDay, weekend ]
}
