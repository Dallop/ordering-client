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

const locations = [
  {
    id: 1,
    title: 'Orem MidiCi',
    address: '541 E University Pkwy, UT 84097',
    availability: { weekModel: 1 },
    availableMethods: [ 1 ],
    availableTimings: [ 1 ]
  },
  {
    id: 2,
    title: 'American Fork MidiCi',
    address: '1723 E Main St. American Fork, UT 84003',
    availability: { weekModel: 2 },
    availableMethods: [ 1 ],
    availableTimings: [ 1 ]
  }
]

const organization = {
  locations,
  availabilitySchedules: [
    {
      id: 1,
      model: [ weekend, weekDay, weekDay, weekDay, weekDay, weekDay, weekend ]
    },
    {
      id: 2,
      model: [ blankDay, weekDay, weekDay, weekDay, weekDay, weekDay, weekend ]
    }
  ],
  menuCategories: [
    { name: 'Burritos', items: [ 1, 2, 3 ] },
    { name: 'Tacos', items: [ 4, 5 ] }
  ],
  options: [
    { id: 1, name: 'Pansy Waist', cost: 0 },
    { id: 2, name: 'Mild Manor', cost: 0 },
    { id: 3, name: 'Tingly Tonya', cost: 3 },
    { id: 4, name: 'Hotter than sun', cost: 6 },
    { id: 5, name: 'Sour Cream', cost: 1 },
    { id: 6, name: 'Steak', cost: 2 },
    { id: 7, name: 'Chicken', cost: 0 },
    { id: 8, name: 'Guacamole', cost: 1 },
    { id: 9, name: 'Extra Cheese', cost: 0.5 },
    { id: 10, name: 'Peppers', cost: 0 },
    { id: 11, name: 'Olives', cost: 0 },
    { id: 12, name: 'Refried Beans', cost: 0 },
    { id: 13, name: 'Lettuce', cost: 0 },
    { id: 14, name: 'Lime Juice', cost: 0 }
  ],
  optionSets: [
    {
      id: 1,
      name: 'Hot Sauce',
      isRequired: true,
      canPickMany: false,
      options: [ 1, 2, 3, 4 ]
    },
    {
      id: 2,
      name: 'Additions',
      isRequired: true,
      canPickMany: true,
      options: [ 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ]
    },
    {
      id: 3,
      name: 'Default Toppings',
      isRequired: false,
      canPickMany: true,
      options: [ 6, 7, 9 ],
      // if this is on then options with costs shouldn't be allowed
      optionsAreDefaults: true
    }
  ],
  menuItems: [
    {
      id: 1,
      name: 'Burrito Supremo',
      description: 'This guy is the super delicious of your dreams.',
      optionSets: [ 1, 2 ],
      priceVariations: [
        { name: 'Peque\xF1o', price: 8.5 },
        { name: 'Grande', price: 11 }
      ]
    },
    {
      id: 2,
      name: 'Burrito Excellente',
      description: 'Fill three crispy corn shells with your choice of meat or sofritas, salsa, guacamole, sour cream or cheese, and romaine lettuce.',
      optionSets: [ 3 ],
      priceVariations: [
        { name: 'Small', price: 7 },
        { name: 'Medium', price: 9 },
        { name: 'Large', price: 12 }
      ]
    },
    {
      id: 3,
      name: 'Burrito Caliente',
      description: 'This guy is the super caliente of your dreams.',
      priceVariations: [ { name: 'default', price: 11.5 } ]
    },
    {
      id: 4,
      name: 'Chicken Taco',
      description: 'I love chicken so we put it in your tacos',
      priceVariations: [ { name: 'default', price: 3.5 } ]
    },
    {
      id: 5,
      name: 'Pork Taco',
      description: 'I love pork so we put it in your tacos',
      priceVariations: [ { name: 'default', price: 4 } ]
    }
  ]
}

const global = {
  orderMethodTypes: [ { id: 1, type: 'PICK_UP', label: 'Pick Up' } ],
  orderTimingTypes: [ { id: 1, type: 'NOW', label: 'Order for Now' } ],
  organizations: [ organization ]
}
