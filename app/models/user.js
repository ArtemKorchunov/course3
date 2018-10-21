'use strict';
const hash = require('../util').hash;

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          message: { email: 'Email has already been taken!.' }
        },
        allowNull: false
      },
      password: { type: DataTypes.STRING, allowNull: false },
      name: DataTypes.STRING
    },
    {
      hooks: {
        beforeCreate: async (user, options) => {
          user.password = await hash(user.password.toString());
        }
      }
    }
  );
  User.associate = function (models) {
    // associations can be defined here
  };
  return User;
};
