'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'Charts',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING
        }
      },
      {
        timestamps: false
      }
    );
  },
  down: queryInterface => {
    return queryInterface.dropTable('Charts');
  }
};
