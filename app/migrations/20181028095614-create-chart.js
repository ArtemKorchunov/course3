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
        model: 'Device', // name of Target model
        key: 'id' // key in Target model that we're referencing
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Charts');
  }
};
