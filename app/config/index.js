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
    secret_jwt_key: process.env.JWT_SECRET || 'secret',
    jwt_expiration: process.env.JWT_EXPIRATION || 3600,
    jwt_expiration_miliseconds: (process.env.JWT_EXPIRATION || 3600) * 1000,
    db: {
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      host: '127.0.0.1',
      dialect: 'mysql',
      operatorsAliases: false
    },
    use_env_variable: 'CLEARDB_DATABASE_URL'
  },
  production: {
    port: process.env.APP_PORT || 7071
  },
  development: {},
  test: {
    port: 7072
  }
};
const config = Object.assign(configs.base, configs[env]);

module.exports = config;
