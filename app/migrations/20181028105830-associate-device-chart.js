'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // Device belongsToMany Chart
    return queryInterface.createTable('DeviceCharts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      device_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Devices',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      chart_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Charts',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: queryInterface => {
    // remove table
    return queryInterface.dropTable('DeviceCharts');
  }
};
