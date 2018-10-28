const config = require('../config');
class Device {
  constructor() {}
  async get(ctx) {
    console.log('YEP!');
  }
  async create(ctx) {}
  async update(ctx) {}
  async delete(ctx) {}
}

module.exports = new Device();
