'use strict';

const Router = require('koa-router');
const Device = require('../controllers/device');
const router = new Router({ prefix: '/device' });

router.get('/', Device.get);
router.post('/', Device.create);
router.put('/:id', Device.update);
router.delete('/:id', Device.delete);

module.exports = router;
