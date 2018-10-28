'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // Device belongsToMany Chart
    return queryInterface.createTable('DeviceCharts', {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      device_id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      chart_id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      }
    });
  },

  down: queryInterface => {
    // remove table
    return queryInterface.dropTable('DeviceCharts');
  }
};
