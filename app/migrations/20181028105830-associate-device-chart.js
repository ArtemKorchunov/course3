'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // Device belongsToMany Chart
    return queryInterface.createTable('DeviceChart', {
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

  down: (queryInterface, Sequelize) => {
    // remove table
    return queryInterface.dropTable('DeviceChart');
  }
};
