'use strict';

const seeders = [
  {
    id: 1,
    name: 'Jan'
  },
  {
    id: 2,
    name: 'Feb'
  },
  {
    id: 3,
    name: 'Mar'
  },
  {
    id: 4,
    name: 'Apr'
  },
  {
    id: 5,
    name: 'May'
  },
  {
    id: 6,
    name: 'Jun'
  },
  {
    id: 7,
    name: 'Jul'
  },
  {
    id: 8,
    name: 'Aug'
  },
  {
    id: 9,
    name: 'Sep'
  },
  {
    id: 10,
    name: 'Oct'
  },
  {
    id: 11,
    name: 'Nov'
  },
  {
    id: 12,
    name: 'Dec'
  }
];

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'Months',
      seeders.map(item => ({
        ...item,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('Charts', null, {});
  }
};
