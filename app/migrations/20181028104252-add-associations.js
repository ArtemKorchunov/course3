'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn(
        'AccessToken', // name of Source model
        'client_id', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Client', // name of Target model
            key: 'id' // key in Target model that we're referencing
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        }
      )
      .then(() => {
        return queryInterface.addColumn('AccessToken', 'user_id', {
          type: Sequelize.INTEGER,
          references: {
            model: 'User', // name of Target model
            key: 'id' // key in Target model that we're referencing
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        });
      })
      .then(() => {
        return queryInterface.addColumn('Device', 'user_id', {
          type: Sequelize.INTEGER,
          references: {
            model: 'User', // name of Target model
            key: 'id' // key in Target model that we're referencing
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        });
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn(
        'AccessToken', // name of Source model
        'client_id' // key we want to remove
      )
      .then(() => {
        return queryInterface.removeColumn(
          'AccessToken', // name of Source model
          'user_id' // key we want to remove
        );
      })
      .then(() => {
        return queryInterface.removeColumn(
          'Device', // name of Source model
          'user_id' // key we want to remove
        );
      });
  }
};
