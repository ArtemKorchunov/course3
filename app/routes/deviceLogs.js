const Router = require('koa-router');
const DeviceLogs = require('../controllers/deviceLogs');
const router = new Router({ prefix: '/device' });

router.all('/:id', DeviceLogs.logById);

module.exports = router;
