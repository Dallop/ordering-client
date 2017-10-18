/**
 1. create array of representing a day in 15 minute periods
 2. translate a given start time and end time into indices
 3. flip bits within start and end indices
 4. given a day data model and a timestamp determine if there is availability to order

 * How do we ensure the time-zone of the client and the restaurant are the same?
*/

const createNewArray = (size, value) => Array(size).fill(value)
export const indexToWeekDay = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]
/* [1] */
export const createNewDay = () => createNewArray(96, 0)

/* [2] */
export const stampToIndex = date =>
  Math.floor((date.getHours() * 60 + date.getMinutes()) / 15)

export const indexToTimeObj = index => {
  const minutes = index * 15

  let hour = Math.floor(minutes / 60)

  let meridiem = 'am'
  if (hour >= 12) {
    meridiem = 'pm'
  }

  if (hour > 12) {
    hour = hour - 12
  }

  let minute = minutes % 60
  if (minute.toString().length < 2) {
    minute = `${minute}0`
  }

  return { hour, minute, meridiem }
}

export const timeObjToString = ({ hour, minute, meridiem }) =>
  `${hour}:${minute} ${meridiem}`

export const indexToTimeString = index =>
  timeObjToString(indexToTimeObj(index))

export const dayModelToString = model => {
  let startIndex = false
  let availabilities = []
  model.forEach((isAvailable, i) => {
    if (isAvailable) {
      if (!startIndex) {
        startIndex = i
      }
    } else {
      if (startIndex) {
        availabilities.push([ startIndex, i ])
        startIndex = false
      }
    }
  })
  return availabilities.map(
    tuple => `${indexToTimeString(tuple[0])} - ${indexToTimeString(tuple[1])}`
  )
}

export const weekModelToString = weekModel => weekModel.map(dayModelToString)

export const createTimestamp = ({ hour, minute, meridiem }) =>
  new Date(`2000-01-01 ${hour}:${minute} ${meridiem}`)

export const addAvailability = ({ startStamp, endStamp, day }) => {
  const startIndex = stampToIndex(startStamp)
  const endIndex = stampToIndex(endStamp)

  /* [3] */
  const availability = createNewArray(endIndex - startIndex, 1)

  return [
    ...day.slice(0, startIndex),
    ...availability,
    ...day.slice(endIndex)
  ]
}

export const isTakingOrders = ({ dayModel, timestamp }) =>
  !!dayModel[stampToIndex(timestamp)]
