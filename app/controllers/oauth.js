const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

const jwt_sign = require('../util').jwt_sign;
const config = require('../config');
class OAuth {
  constructor() {}

  async create(ctx) {
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
        body.token = jwt_sign({
          user_id: user.id,
          client_id: current_client.id
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
            expiresIn: Date.now() + config.jwt_expiration_miliseconds
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
    ctx.checkBody('token').require();
    ctx.checkBody('refreshToken').require();
    if (ctx.errors) {
      return ctx.res.unprocessableEntity({
        data: ctx.errors,
        message: 'Unprocessable entity!'
      });
    }

    const { token: oldToken, refreshToken: oldRefreshToken } = ctx.request.body;
    try {
      const decoded = jwt.verify(oldToken, config.secret_jwt_key);
      let body = {};
      body.token = jwt_sign(decoded);
      body.refreshToken = uuidv4();
      await ctx.models.AccessToken.update(
        {
          ...body,
          ...decoded
        },
        {
          where: {
            token: oldToken,
            refreshToken: oldRefreshToken
          }
        }
      );
      return ctx.res.ok({
        data: {
          ...body,
          expiresIn: Date.now() + config.jwt_expiration_miliseconds
        },
        message: 'Token successfully updated!'
      });
    } catch ({ errors }) {
      return ctx.res.unprocessableEntity({
        data: {
          token: ["Wrong token or it's already expired!"],
          ...errors
        },
        message: 'Unprocessable entity!'
      });
    }
  }

  async logout(ctx) {
    ctx.checkBody('token').require();
    if (ctx.errors) {
      return ctx.res.unprocessableEntity({
        data: ctx.errors,
        message: 'Unprocessable entity!'
      });
    }
    await ctx.models.AccessToken.destroy({
      where: { token: ctx.request.body.token }
    });
    return ctx.res.ok({
      message: 'Logged out successfully!'
    });
  }
}

module.exports = new OAuth();
