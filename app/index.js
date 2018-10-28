#!/usr/bin/env node

'use strict';

// Load APM on production environment
const config = require('./config');

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const errorHandler = require('./middlewares/errorHandler');
const logMiddleware = require('./middlewares/log');
const logger = require('./logger');
const requestId = require('./middlewares/requestId');
const responseHandler = require('./middlewares/responseHandler');

const oauth = require('./routes/oauth');
const router = require('./routes/general');

const models = require('./models');

const app = new Koa();
require('koa-validate')(app);

// Trust proxy
app.proxy = true;

// Set middlewares
app.use(
  bodyParser({
    enableTypes: ['json', 'form', 'application/json'],
    formLimit: '10mb',
    jsonLimit: '10mb',
    multipart: true
  })
);

app.use(requestId());
app.use(
  cors({
    origin: '*',
    allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
    exposeHeaders: ['X-Request-Id']
  })
);
app.use(responseHandler());
app.use(errorHandler());
app.use(logMiddleware({ logger }));

// Bootstrap application router

app.use(oauth.routes());
app.use(router.routes());
app.use(router.allowedMethods());

app.context.models = models;

function onError(err, ctx) {
  if (ctx == null)
    logger.error({ err, event: 'error' }, 'Unhandled exception occured');
}

// Handle uncaught errors
app.on('error', onError);
// Start server
if (!module.parent) {
  const server = app.listen(config.port, () => {
    logger.info(
      { event: 'execute' },
      `API server listening on ${config.host}:${config.port}, in ${config.env}`
    );
  });
  server.on('error', onError);
}

// Expose app
module.exports = app;
