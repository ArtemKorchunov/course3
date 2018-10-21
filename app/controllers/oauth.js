const jwt = require('jsonwebtoken');

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
      const res = await ctx.models.User.create(ctx.request.body);
    } catch (err) {
      console.log(err);
    }
    console.log(res);

    return ctx.res.ok();
    // await Users.create();
  }

  check() {}

  updateToken(ctx) {}

  logout(ctx) {}
}

module.exports = new OAuth();
