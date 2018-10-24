'use strict';

const Router = require('koa-router');
const OAuth = require('../controllers/oauth');
const router = new Router({ prefix: '/oauth' });

router.post('/token', OAuth.create);
router.post('/login', OAuth.check);

module.exports = router;
