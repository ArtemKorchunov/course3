'use strict';

const Router = require('koa-router');
const Device = require('../controllers/device');
const validate = require('../middlewares/validation');
const router = new Router({ prefix: '/device' });

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
  Device.get
);
router.get(
  '/:id',
  validate(ctx => {
    ctx.checkParams('id').toInt();
  }),
  Device.getById
);
router.post(
  '/',
  validate(ctx => {
    ctx.checkBody('name').notEmpty();
    ctx.checkBody('sensor_id').notEmpty();
    ctx
      .checkBody('description')
      .optional()
      .trim()
      .len(1, 100);
    ctx
      .checkBody('charts')
      .notEmpty()
      .clone('chart_ids');
  }),
  Device.create
);
router.put(
  '/:id',
  validate(ctx => {
    ctx.checkParams('id').toInt();
    ctx
      .checkBody('charts')
      .optional()
      .clone('chart_ids');
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

router.get('/:id');
module.exports = router;
