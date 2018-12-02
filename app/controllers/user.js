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
      const currentUser = await ctx.models.User.findById(user_id);
      if (!currentUser.admin) throw new Error('You do not have much rights!');
      const users = await ctx.models.User.findAll({
        offset: ctx.query.page * ctx.query.count,
        limit: ctx.query.count,
        where: { admin: 0 },
        attributes: ['id', 'email', 'banned', 'name']
      });
      return ctx.res.ok({
        data: users
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
  async getById(ctx) {
    const {
      data: { user_id }
    } = jwt.decode(
      ctx.headers.authorization.split(' ')[1],
      config.secret_jwt_key
    );
    try {
      const currentUser = await ctx.models.User.findById(user_id);
      if (!currentUser.admin) throw new Error('You do not have much rights!');
      const user = await ctx.models.User.findOne({
        where: { id: ctx.params.id },
        attributes: ['id', 'name', 'email', 'banned']
      });
      return ctx.res.ok({
        data: user
      });
    } catch ({ errors = [] }) {
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
    const {
      data: { user_id }
    } = jwt.decode(
      ctx.headers.authorization.split(' ')[1],
      config.secret_jwt_key
    );
    try {
      const currentUser = await ctx.models.User.findById(user_id);
      if (!currentUser.admin) throw new Error('You do not have much rights!');
      const userSelected = await ctx.models.User.findById(ctx.params.id);
      if (userSelected.admin) throw new Error('You do not have much rights!');
      await userSelected.update(ctx.request.body);
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
    const {
      data: { user_id }
    } = jwt.decode(
      ctx.headers.authorization.split(' ')[1],
      config.secret_jwt_key
    );
    try {
      const currentUser = await ctx.models.User.findById(user_id);
      if (!currentUser.admin) throw new Error('You do not have much rights!');
      const userSelected = await ctx.models.User.findById(ctx.params.id);
      if (userSelected.admin) throw new Error('You do not have much rights!');
      await ctx.models.User.destroy({
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

module.exports = new Device();
