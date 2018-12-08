// const config = require('../config');
const uuidv4 = require('uuid/v4');
class IoT {
  constructor() {}

  async getLoggerInfo(ctx) {
    ctx.io
      .of('/device')
      .to(`device_${ctx.query.identifier}`)
      .emit('payload', { heat: ctx.query.heat, prediction: [0.2] });
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
