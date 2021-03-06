const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

const jwt_sign = require('../util').jwt_sign;
const config = require('../config');
class OAuth {
  constructor() {}
  async create(ctx) {
    // Current logic
    const { name = null, email, password } = ctx.request.body;
    try {
      await ctx.models.User.create({ name, email, password });
    } catch (err) {
      return ctx.res.unprocessableEntity({
        data: err.errors ? err.errors.reduce(
          (prevItem, item) => ({ ...prevItem, [item.path]: item.message }),
          {}
        ) : err,
        message: 'Unprocessable entity!'
      });
    }
    return ctx.res.created();
  }

  async check(ctx) {
    // Current logic
    try {
      const current_client = await ctx.models.Client.findOne({
        where: { name: config.client_name }
      });
      const user = await ctx.models.User.findOne({
        where: { email: ctx.request.body.email }
      });
      if (!user || user.banned) {
        return ctx.res.unprocessableEntity({
          data: { email: ['Email is not correct!'] }
        });
      }
      if (user.checkPassword(ctx.request.body.password)) {
        let body = {};
        const expiresIn = Math.floor(Date.now() / 1000) + config.jwt_expiration;
        body.token = jwt_sign({
          data: {
            user_id: user.id,
            client_id: current_client.id,
            admin: user.admin
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
            expiresIn,
            admin: user.admin
          },
          message: 'Successfully loged in!'
        });
      } else {
        return ctx.res.unprocessableEntity({
          data: { password: ['Password is not correct!'] },
          message: 'Unprocessable entity!'
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
    // Current logic
    const { token: oldToken, refreshToken: oldRefreshToken } = ctx.request.body;
    try {
      const decoded = jwt.decode(oldToken);
      let body = {};
      const expiresIn = Math.floor(Date.now() / 1000) + config.jwt_expiration;
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
          },
          returning: true,
          plain: true
        }
      );
      if (token.length < 2 && !token.pop())
        throw new Error('This token is outdated!');
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
    // Current logic
    try {
      const decoded = jwt.decode(ctx.request.headers.token);
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
