#!/usr/bin/env node

'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('kcors');
const config = require('./config');
const logMiddleware = require('./middlewares/log');
const logger = require('./logger');
const requestId = require('./middlewares/requestId');
const responseHandler = require('./middlewares/responseHandler');
const router = require('./routes');


const app = new Koa();

// Set middlewares
app.use(
  bodyParser({
    enableTypes: ['json', 'form'],
    formLimit: '10mb',
    jsonLimit: '10mb'
  })
);
app.use(requestId());
app.use(logMiddleware({ logger }));
app.use(
  cors({
    origin: '*',
    allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
    exposeHeaders: ['X-Request-Id']
  })
);
app.use(responseHandler());

// Bootstrap application router
app.use(router.routes());
app.use(router.allowedMethods());

// Handle uncaught errors
app.on('error', err => {
  logger.error({ err, event: 'error' }, 'Unhandled exception occured');
});

// Start server
if (!module.parent) {
  app.listen(config.port, config.host, () => {
    logger.info(`API server listening on ${config.host}:${config.port}, in ${config.env}`);
  });
}

// Expose app
module.exports = app;
