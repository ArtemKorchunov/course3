'use strict';
module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define(
    'Client',
    {
      name: DataTypes.STRING,
      clientId: DataTypes.STRING,
      clientSecret: DataTypes.STRING,
      isTrusted: DataTypes.BOOLEAN,
      createdAt: {
        type: DataTypes.DATE,
        field: 'beginTime',
        defaultValue: sequelize.literal('NOW()')
      }
    },
    {
      timestamps: true
    }
  );
  Client.associate = function (models) {
    // associations can be defined here
  };
  return Client;
};
