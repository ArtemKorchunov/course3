'use strict';
const bcrypt = require('bcrypt');
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
      name: DataTypes.STRING,
      admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      banned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      hooks: {
        beforeCreate: async user => {
          user.password = await hash(user.password.toString());
        }
      }
    }
  );
  User.prototype.checkPassword = function (other_pass) {
    return bcrypt.compareSync(other_pass, this.password);
  };
  User.associate = function (models) {
    User.hasMany(models.Device, {
      foreignKey: 'user_id'
    });
  };
  return User;
};
