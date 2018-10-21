'use strict';
module.exports = (sequelize, DataTypes) => {
  const AccessToken = sequelize.define(
    'AccessToken',
    {
      token: DataTypes.STRING,
      refreshToken: DataTypes.STRING
    },
    {}
  );
  AccessToken.associate = function (models) {
    AccessToken.belongsTo(models.Client, {
      foreignKey: 'client_id'
    });

    AccessToken.belongsTo(models.User, {
      foreignKey: 'user_id'
    });
  };
  return AccessToken;
};
