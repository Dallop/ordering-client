export const selectors = {
  getMenu () {
    return {
      menuCategories: [
        { name: 'Burritos', items: [ 1, 2, 3 ] },
        { name: 'Tacos', items: [ 4, 5 ] }
      ],
      menuItems: {
        1: {
          id: 1,
          name: 'Burrito Supremo',
          description: 'This guy is the super delicious of your dreams.',
          price: 8.5
        },
        2: {
          id: 2,
          name: 'Burrito Excellente',
          description: 'Fill three crispy corn shells with your choice of meat or sofritas, salsa, guacamole, sour cream or cheese, and romaine lettuce.',
          price: 9
        },
        3: {
          id: 3,
          name: 'Burrito Caliente',
          description: 'This guy is the super caliente of your dreams.',
          price: 11.5
        },
        4: {
          id: 4,
          name: 'Chicken Taco',
          description: 'I love chicken so we put it in your tacos',
          price: 3.5
        },
        5: {
          id: 5,
          name: 'Pork Taco',
          description: 'I love pork so we put it in your tacos',
          price: 4
        }
      }
    }
  }
}
