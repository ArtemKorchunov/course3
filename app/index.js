#!/usr/bin/env node

'use strict';

// Load APM on production environment
const config = require('./config');

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const jwt = require('koa-jwt');

const errorHandler = require('./middlewares/errorHandler');
const logMiddleware = require('./middlewares/log');
const logger = require('./logger');
const requestId = require('./middlewares/requestId');
const responseHandler = require('./middlewares/responseHandler');
const DeviceSocket = require('./controllers/deviceSocket');

const oauth = require('./routes/oauth');
const router = require('./routes/general');
const device = require('./routes/device');
const chart = require('./routes/chart');
const user = require('./routes/user');
const iot = require('./routes/iot');

const models = require('./models');

const app = new Koa();
const http = require('http').createServer(app.callback());

const io = require('socket.io')(http, { path: '/listen' });

require('koa-validate')(app);

// Trust proxy & Enable CORS
app.proxy = true;
app.use(cors());

// Create Namespace for socket
const nsp = io.of('/device');
const DeviceInstance = DeviceSocket(io, nsp);
DeviceInstance.connect = DeviceInstance.connect.bind(DeviceInstance);

nsp.on('connection', DeviceInstance.connect);

// Middleware below this line is only reached if JWT token is valid
// unless the URL starts with '/public'
app.use(
  jwt({ secret: config.secret_jwt_key }).unless({ path: [/^\/oauth|iot/] })
);

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

app.use(responseHandler());
app.use(errorHandler());
app.use(logMiddleware({ logger }));

// Bootstrap application router
app.use(chart.routes());
app.use(device.routes());
app.use(oauth.routes());
app.use(router.routes());
app.use(user.routes());
app.use(router.allowedMethods());
app.use(iot.routes());

app.context.models = models;
app.context.io = io;

function onError(err, ctx) {
  if (ctx == null)
    logger.error({ err, event: 'error' }, 'Unhandled exception occured');
}

// Handle uncaught errors
app.on('error', onError);
// Start server
if (!module.parent) {
  const server = http.listen(config.port, () => {
    logger.info(
      { event: 'execute' },
      `API server listening on ${config.host}:${config.port}, in ${config.env}`
    );
  });
  app.on('error', onError);
}

// Expose app
module.exports = app;
