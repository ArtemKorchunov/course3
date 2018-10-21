const bcrypt = require('bcrypt');

module.exports.hash = (password, saltRounds = 10) =>
  new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });
