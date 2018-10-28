'use strict';

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'Charts',
      [
        {
          name: 'Footfall'
        },
        {
          name: 'Heatmap'
        },
        {
          name: 'Diagram'
        }
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('Charts', null, {});
  }
};
