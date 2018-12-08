'use strict';
const { client_name, iot_name } = require('../config');

const seeders = [
  {
    name: client_name,
    clientId: '11111111111',
    clientSecret: 'secretIdOfClientSecret',
    isTrusted: true
  },
  {
    name: iot_name,
    clientId: '22222222222',
    clientSecret: 'secretIdOfIoTSecret',
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
