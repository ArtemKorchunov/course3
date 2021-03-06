'use strict';

const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const env = process.env.NODE_ENV || 'development';
const configs = {
  base: {
    env,
    name: process.env.APP_NAME || 'koa-rest-api-boilerplate',
    host: process.env.APP_HOST || '0.0.0.0',
    port: 4000,
    token_expiration: 5000,
    client_name: 'application',
    iot_name: 'iot-device',
    secret_jwt_key: process.env.JWT_SECRET || 'secret',
    jwt_expiration: process.env.JWT_EXPIRATION || 3600,
    jwt_expiration_miliseconds: (process.env.JWT_EXPIRATION || 360000) * 1000,
    db: {
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      host: 'locahost',
      dialect: 'mysql',
      operatorsAliases: false
    },
    gmailAuth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASS
    }
  },
  production: {
    port: process.env.PORT || 7071
  },
  development: {},
  test: {
    port: 7072
  }
};
const config = Object.assign(configs.base, configs[env]);

module.exports = config;
