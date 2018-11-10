'use strict';
const client_name = require('../config').client_name;

const seeders = [
  {
    name: client_name,
    clientId: '11111111111',
    clientSecret: 'secretIdOfClientSecret',
    isTrusted: true
  }
];

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'Clients',
      seeders.map(item => ({
        ...item,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('Clients', null, {});
  }
};
