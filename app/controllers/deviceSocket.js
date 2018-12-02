const brain = require('brain.js');
const jwt = require('jsonwebtoken');

const models = require('../models');
const config = require('../config');
const dataset = require('../datasets/temperature.json');
const network = new brain.NeuralNetwork();
class DeviceLogs {
  constructor(io, nsp) {
    this.io = io;
    this.nsp = nsp;
    network.train(dataset);
  }

  connect(client) {
    const { query } = client.handshake;
    if (query.token && query.device) this.deviceLogger(client, query);
  }

  async deviceLogger(client, query) {
    try {
      const { data } = await jwt.verify(query.token, config.secret_jwt_key);
      await models.Device.findOne({
        where: { user_id: data.user_id, id: query.device },
        attributes: ['id', 'name', 'description', 'status']
      });
      client.join(`device_${query.device}`);
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        const heat = Math.random() * 100;
        const prediction = network.run([heat]);
        this.io
          .of('/device')
          .to(`device_${query.device}`)
          .emit('payload', { heat, prediction });
      }, 3000);
    } catch (err) {
      client.emit('payload', 'Something went wrong');
    }
  }
}

module.exports = io => new DeviceLogs(io);
