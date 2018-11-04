'use strict';

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'Charts',
      [
        {
          name: 'Footfall',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Heatmap',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Diagram',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('Charts', null, {});
  }
};
