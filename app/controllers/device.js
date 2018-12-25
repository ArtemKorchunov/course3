const jwt = require('jsonwebtoken');
const config = require('../config');

class Device {
  constructor() {}

  async get(ctx) {
    const {
      data: { user_id }
    } = jwt.decode(
      ctx.headers.authorization.split(' ')[1],
      config.secret_jwt_key
    );
    try {
      const devices = await ctx.models.Device.findAll({
        offset: ctx.query.page * ctx.query.count,
        limit: ctx.query.count,
        where: { user_id: user_id }
      });
      return ctx.res.ok({
        data: devices
      });
    } catch (err) {
      console.log(err);
    }
  }

  async getById(ctx) {
    const {
      data: { user_id }
    } = jwt.decode(
      ctx.headers.authorization.split(' ')[1],
      config.secret_jwt_key
    );
    try {
      const device = await ctx.models.Device.findOne({
        where: { user_id, id: ctx.params.id },
        attributes: ['id', 'name', 'description', 'status']
      });
      return ctx.res.ok({
        data: device
      });
    } catch (err) {
      console.log(err);
    }
  }

  async create(ctx) {
    const { chart_ids, sensor_id, ...otherBody } = ctx.request.body;
    const charts = [...new Set(chart_ids)];
    try {
      const { data } = jwt.decode(ctx.headers.authorization.split(' ')[1]);
      const device = await ctx.models.Device.create({
        ...otherBody,
        user_id: data.user_id
      });
      await device.addCharts(charts);
      const sensor = await ctx.models.Sensor.find({ where: { id: sensor_id } });
      if (sensor) {
        sensor.update({
          device_id: device.id
        });
      }
      return ctx.res.created({
        message: 'Device created successfully!'
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

  async update(ctx) {
    const { charts = null, ...otherBody } = ctx.request.body;
    try {
      const filteredCharts = [...new Set(charts)];
      const {
        data: { user_id }
      } = jwt.decode(ctx.headers.authorization.split(' ')[1]);
      const currentDevice = await ctx.models.Device.findOne({
        id: ctx.params.id,
        user_id
      });
      if (charts) await currentDevice.setCharts(filteredCharts);
      await currentDevice.update(otherBody);
      return ctx.res.ok({
        message: 'Updated successfully!'
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
  async delete(ctx) {
    try {
      const {
        data: { user_id }
      } = jwt.decode(ctx.headers.authorization.split(' ')[1]);
      await ctx.models.Device.destroy({
        where: { id: ctx.params.id, user_id }
      });
      return ctx.res.ok({
        message: 'Device was deleted successfully!'
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
