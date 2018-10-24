'use strict';
module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define(
    'Client',
    {
      name: DataTypes.STRING,
      clientId: DataTypes.STRING,
      clientSecret: DataTypes.STRING,
      isTrusted: DataTypes.BOOLEAN
    },
    {
      timestamps: true
    }
  );
  return Client;
};
