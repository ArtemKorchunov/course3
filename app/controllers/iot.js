// const config = require('../config');
const uuidv4 = require('uuid/v4');
const brain = require('brain.js');

const dataset = require('../datasets/temperature.json');
const network = new brain.NeuralNetwork();
class IoT {
  constructor() {
    network.train(dataset);
  }

  async getLoggerInfo(ctx) {
    const prediction = network.run([ctx.query.heat]);
    ctx.io
      .of('/device')
      .to(`device_${ctx.query.identifier}`)
      .emit('payload', { heat: ctx.query.heat, prediction });
  }

  async iotAuth(ctx) {
    // Current logic
    const { name } = ctx.request.body;
    const identifier = uuidv4();
    try {
      await ctx.models.Sensor.create({ identifier, name });
      ctx.res.created({
        data: { identifier }
      });
    } catch ({ errors }) {
      return ctx.res.unprocessableEntity({
        data: errors.reduce(
          (prevItem, item) => ({ ...prevItem, [item.path]: item.message }),
          {}
        ),
        message: 'Unprocessable entity!'
      });
    }
  }
}

module.exports = new IoT();
