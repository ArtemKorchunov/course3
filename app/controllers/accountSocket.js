const jwt = require('jsonwebtoken');

const config = require('../config');

class AccountLogs {
  constructor(io, nsp) {
    this.io = io;
    this.nsp = nsp;
  }

  connect(client) {
    const { query } = client.handshake;
    if (query.token) this.accountLogger(client, query);
  }

  async accountLogger(client, query) {
    try {
      const { data } = await jwt.verify(query.token, config.secret_jwt_key);
      client.join(`account_${data.user_id}`);
    } catch (err) {
      client.emit('payload', 'Something went wrong');
    }
  }
}

module.exports = io => new AccountLogs(io);
