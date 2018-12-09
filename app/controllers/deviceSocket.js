const jwt = require('jsonwebtoken');

const models = require('../models');
const config = require('../config');

class DeviceLogs {
  constructor(io, nsp) {
    this.io = io;
    this.nsp = nsp;
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
      const currentSensor = await models.Sensor.findOne({
        where: { device_id: query.device }
      });
      client.join(`device_${currentSensor.identifier}`);
    } catch (err) {
      client.emit('payload', 'Something went wrong');
    }
  }
}

module.exports = io => new DeviceLogs(io);
