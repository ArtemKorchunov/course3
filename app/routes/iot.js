'use strict';

const Router = require('koa-router');
const IoT = require('../controllers/iot');
const validate = require('../middlewares/validation');

const router = new Router({ prefix: '/iot' });

IoT.getLoggerInfo = IoT.getLoggerInfo.bind(IoT);

router.post(
  '/auth',
  validate(ctx => {
    ctx.checkBody('name').len(3, 20);
  }),
  IoT.iotAuth
);

router.get(
  '/logger',
  validate(ctx => {
    ctx.checkQuery('identifier').notEmpty();
  }),
  IoT.getLoggerInfo
);

module.exports = router;
