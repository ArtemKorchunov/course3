'use strict';

const Router = require('koa-router');
const OAuth = require('../controllers/oauth');
const router = new Router({ prefix: '/oauth' });

router.post('/token', OAuth.create);
router.post('/login', OAuth.check);
router.put('/token', OAuth.updateToken);
router.post('/logout', OAuth.logout);

module.exports = router;
