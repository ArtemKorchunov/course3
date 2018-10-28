const config = require('../config');
class Device {
  constructor() {}
  async get(ctx) {}
  async create(ctx) {
    const { chart_ids, ...otherBody } = ctx.request.body;
    const charts = [...new Set(chart_ids)];
    try {
      const device = ctx.models.Device.create(otherBody);
      await Promise.all(
        charts.map(chart_id =>
          ctx.models.DeviceChart.create({ device_id: device.id, chart_id })
        )
      );
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
  async update(ctx) {
    const body = ctx.request.body;
    try {
      const currentDevice = ctx.models.Device.findById(ctx.params.id);
      console.log(currentDevice);
    } catch (err) {}
  }
  async delete(ctx) {
    try {
      await ctx.models.Device.destroy({
        where: { token: ctx.params.id }
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

module.exports = new Device();
