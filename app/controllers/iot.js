// const config = require('../config');
const uuidv4 = require('uuid/v4');
const brain = require('brain.js');

const dataset = require('../datasets/temperature.json');
const network = new brain.NeuralNetwork();
class IoT {
  constructor() {
    network.train(dataset);
  }

  getLoggerInfo(ctx) {
    const prediction = network.run([ctx.query.heat]);
    ctx.io
      .of('/device')
      .to(`device_${ctx.query.identifier}`)
      .emit('payload', { heat: ctx.query.heat, prediction });
  }

  async analyzeLogs(msg) {}

  async iotAuth(ctx) {
    // Current logic
    const { name, identifier = null } = ctx.request.body;
    let currentIdentifier;

    if (identifier) currentIdentifier = identifier;
    else currentIdentifier = uuidv4();

    try {
      let currentSensor;
      currentSensor = await ctx.models.Sensor.findOne({
        where: {
          identifier: currentIdentifier
        }
      });
      if (!currentSensor) {
        currentSensor = await ctx.models.Sensor.create({
          identifier: currentIdentifier,
          name
        });
      }
      ctx.res.created({
        data: { identifier: currentIdentifier, id: currentSensor.id }
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
