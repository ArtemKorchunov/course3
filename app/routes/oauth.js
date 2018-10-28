'use strict';

const Router = require('koa-router');
const OAuth = require('../controllers/oauth');
const validateBody = require('../middlewares/validation');

const router = new Router({ prefix: '/oauth' });

router.post(
  '/token',
  validateBody(ctx => {
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
  }),
  OAuth.create
);

router.post(
  '/login',
  validateBody(ctx => {
    ctx.checkBody('email').isEmail('You enter not valid email !');
    ctx
      .checkBody('password')
      .notEmpty()
      // Initial validation
      .len(3, 20);
  }),
  OAuth.check
);

router.put(
  '/token',
  validateBody(ctx => {
    ctx.checkBody('token').notEmpty();
    ctx.checkBody('refreshToken').notEmpty();
  }),
  OAuth.updateToken
);

router.post(
  '/logout',
  validateBody(ctx => {
    ctx.checkBody('token').notEmpty();
  }),
  OAuth.logout
);

module.exports = router;
