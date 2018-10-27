const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../config');

module.exports.hash = (password, saltRounds = 10) =>
  new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });

module.exports.jwt_sign = data => {
  return jwt.sign(data, config.secret_jwt_key);
};
