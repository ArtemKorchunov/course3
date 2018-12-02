'use strict';

const Router = require('koa-router');
const User = require('../controllers/user');
const validate = require('../middlewares/validation');
const router = new Router({ prefix: '/user' });

router.get(
  '/',
  validate(ctx => {
    ctx
      .checkQuery('count')
      .notEmpty()
      .toInt();
    ctx
      .checkQuery('page')
      .notEmpty()
      .toInt();
  }),
  User.get
);
router.put(
  '/:id',
  validate(ctx => {
    ctx.checkParams('id').toInt();
  }),
  User.update
);
router.delete(
  '/:id',
  validate(ctx => {
    ctx.checkParams('id').toInt();
  }),
  User.delete
);

module.exports = router;
