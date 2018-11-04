'use strict';

const Router = require('koa-router');
const Chart = require('../controllers/chart');
const validate = require('../middlewares/validation');
const router = new Router({ prefix: '/chart' });

router.get('/', Chart.get);
router.post(
  '/',
  validate(ctx => {
    ctx.checkBody('name').notEmpty();
  }),
  Chart.create
);
router.put(
  '/:id',
  validate(ctx => {
    ctx.checkParams('id').toInt();
    ctx.checkBody('name').optional();
  }),
  Chart.update
);
router.delete(
  '/:id',
  validate(ctx => {
    ctx.checkParams('id').toInt();
  }),
  Chart.delete
);

module.exports = router;
