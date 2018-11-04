const jwt = require('jsonwebtoken');
const config = require('../config');

class Chart {
  constructor() {}

  async get(ctx) {
    const charts = await ctx.models.Chart.findAll({
      attributes: ['name', 'id']
    });
    return ctx.res.ok({
      data: charts
    });
  }

  async create(ctx) {
    try {
      // const { data } = jwt.decode(ctx.headers.authorization.split(' ')[1]);
      const chart = await ctx.models.Chart.create({
        ...ctx.request.body
      });
      return ctx.res.created({
        message: 'Chart was created successfully!'
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
    try {
      //   const {
      //     data
      //   } = jwt.decode(ctx.headers.authorization.split(' ')[1]);
      const currentDevice = await ctx.models.Chart.findOne({
        where: { id: ctx.params.id }
      });
      await currentDevice.update(ctx.request.body);
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
      // const { data } = jwt.decode(ctx.headers.authorization.split(' ')[1]);
      await ctx.models.Chart.destroy({
        where: { id: ctx.params.id }
      });
      return ctx.res.ok({
        message: 'Chart was deleted successfully!'
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

module.exports = new Chart();
