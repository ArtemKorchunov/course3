'use strict';

const seeders = [
  {
    name: 'Footfall'
  },
  {
    name: 'Heatmap'
  },
  {
    name: 'Diagram'
  }
];

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'Charts',
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
