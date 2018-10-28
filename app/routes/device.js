'use strict';

const Router = require('koa-router');
const Device = require('../controllers/device');
const validate = require('../middlewares/validation');
const router = new Router({ prefix: '/device' });

router.get(
  '/',
  validate(ctx => {
    ctx.checkParams('id').toInt();
  }),
  Device.get
);
router.post(
  '/',
  validate(ctx => {
    ctx.checkBody('name').notEmpty();
    ctx
      .checkBody('description')
      .optional()
      .trim()
      .len(1, 100);
    ctx
      .checkBody('charts')
      .notEmpty()
      .isNumeric()
      .clone('chart_ids');
  }),
  Device.create
);
router.put(
  '/:id',
  validate(ctx => {
    ctx.checkParams('id').toInt();
  }),
  Device.update
);
router.delete(
  '/:id',
  validate(ctx => {
    ctx.checkParams('id').toInt();
  }),
  Device.delete
);

module.exports = router;
