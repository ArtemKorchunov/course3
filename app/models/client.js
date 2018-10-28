'use strict';
module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define(
    'Client',
    {
      name: DataTypes.STRING,
      clientId: {
        type: DataTypes.STRING,
        unique: true
      },
      clientSecret: DataTypes.STRING,
      isTrusted: DataTypes.BOOLEAN
    },
    {
      timestamps: true
    }
  );
  return Client;
};
