'use strict';

const Router = require('koa-router');
const Statistic = require('../controllers/statistic');
const router = new Router({ prefix: '/statistic' });

router.get('/month', Statistic.getMonthStatistic);
router.get('/temperature-level', Statistic.getTemperatureLevelStatistic);

module.exports = router;
