'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('AccessTokens', 'client_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'Clients',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      })
      .then(() => {
        return queryInterface.addColumn('AccessTokens', 'user_id', {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        });
      })
      .then(() => {
        return queryInterface.addColumn('Devices', 'user_id', {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        });
      })
      .then(() => {
        return queryInterface.addColumn('Devices', 'categorie_id', {
          type: Sequelize.INTEGER,
          references: {
            model: 'DeviceCategories',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        });
      });
  },
  down: queryInterface => {
    return queryInterface
      .removeColumn('AccessTokens', 'client_id')
      .then(() => {
        return queryInterface.removeColumn('AccessTokens', 'user_id');
      })
      .then(() => {
        return queryInterface.removeColumn('Devices', 'user_id');
      })
      .then(() => {
        return queryInterface.removeColumn('Devices', 'categorie_id');
      });
  }
};
