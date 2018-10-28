'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Charts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      references: {
        model: 'Device',
        key: 'id'
      }
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('Charts');
  }
};
