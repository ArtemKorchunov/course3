const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

const jwt_sign = require('../util').jwt_sign;
const config = require('../config');
// TODO retrieve base validation logic to middlewear with koa joi
class OAuth {
  constructor() {}
  async create(ctx) {
    // Initial validation
    ctx.checkBody('email').isEmail('You enter not valid email !');
    ctx
      .checkBody('password')
      .notEmpty()
      .len(3, 20);
    ctx
      .checkBody('name')
      .optional()
      .empty()
      .len(3, 20);

    if (ctx.errors) {
      return ctx.res.unprocessableEntity({
        data: ctx.errors,
        message: 'Unprocessable entity!'
      });
    }
    // Current logic
    try {
      await ctx.models.User.create(ctx.request.body);
    } catch ({ errors }) {
      return ctx.res.unprocessableEntity({
        data: errors,
        message: 'Unprocessable entity!'
      });
    }
    return ctx.res.ok();
  }

  async check(ctx) {
    // Initial validation
    ctx.checkBody('email').isEmail('You enter not valid email !');
    ctx
      .checkBody('password')
      .notEmpty()
      .len(3, 20);
    if (ctx.errors) {
      return ctx.res.unprocessableEntity({
        data: ctx.errors,
        message: 'Unprocessable entity!'
      });
    }
    // Current logic
    try {
      const current_client = await ctx.models.Client.findOne({
        where: { name: config.client_name }
      });
      const user = await ctx.models.User.findOne({
        where: { email: ctx.request.body.email }
      });
      if (!user) {
        return ctx.res.unprocessableEntity({
          email: ['Email is not correct!']
        });
      }
      if (user.checkPassword(ctx.request.body.password)) {
        let body = {};
        const expiresIn = Math.floor(
          (Date.now() + config.jwt_expiration_miliseconds) / 1000
        );
        body.token = jwt_sign({
          data: {
            user_id: user.id,
            client_id: current_client.id
          },
          exp: expiresIn
        });
        body.refreshToken = uuidv4();
        await ctx.models.AccessToken.create({
          ...body,
          user_id: user.id,
          client_id: current_client.id
        });
        return ctx.res.ok({
          data: {
            ...body,
            expiresIn
          },
          message: 'Successfully loged in!'
        });
      } else {
        return ctx.res.unprocessableEntity({
          password: ['Password is not correct!']
        });
      }
    } catch ({ errors }) {
      return ctx.res.unprocessableEntity({
        data: errors,
        message: 'Unprocessable entity!'
      });
    }
  }

  async updateToken(ctx) {
    // Initial validation
    ctx.checkBody('token').notEmpty();
    ctx.checkBody('refreshToken').notEmpty();
    if (ctx.errors) {
      return ctx.res.unprocessableEntity({
        data: ctx.errors,
        message: 'Unprocessable entity!'
      });
    }
    // Current logic
    const { token: oldToken, refreshToken: oldRefreshToken } = ctx.request.body;
    try {
      const decoded = jwt.decode(oldToken);
      let body = {};
      const expiresIn = Math.floor(
        (Date.now() + config.jwt_expiration_miliseconds) / 1000
      );
      body.token = jwt_sign({
        data: decoded.data,
        exp: expiresIn
      });
      body.refreshToken = uuidv4();
      const token = await ctx.models.AccessToken.update(
        {
          ...body
        },
        {
          where: {
            token: oldToken,
            refreshToken: oldRefreshToken
          }
        }
      );
      if (!token.pop()) throw new Error('This token is outdated!');
      return ctx.res.ok({
        data: {
          ...body,
          expiresIn
        },
        message: 'Token successfully updated!'
      });
    } catch ({ errors, message }) {
      return ctx.res.unprocessableEntity({
        data: {
          ...errors
        },
        message: message || 'Unprocessable entity!'
      });
    }
  }

  async logout(ctx) {
    // Initial validation
    ctx.checkBody('token').notEmpty();
    if (ctx.errors) {
      return ctx.res.unprocessableEntity({
        data: ctx.errors,
        message: 'Unprocessable entity!'
      });
    }
    // Current logic
    try {
      const decoded = jwt.decode(ctx.request.body.token);
      if (!decoded) throw new Error('Token is not valid!');

      const res = await ctx.models.AccessToken.destroy({
        where: { token: ctx.request.body.token }
      });
      if (!res) throw new Error('Token is not exist!');

      return ctx.res.ok({
        message: 'Logged out successfully!'
      });
    } catch ({ errors, message }) {
      return ctx.res.unprocessableEntity({
        data: {
          ...errors
        },
        message: message || 'Unprocessable entity!'
      });
    }
  }
}

module.exports = new OAuth();
