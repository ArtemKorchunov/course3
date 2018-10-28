'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'ChartTypes',
      [
        {
          name: 'Heatmap',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Footfall',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Linear',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ChartTypes', null, {});
  }
};
