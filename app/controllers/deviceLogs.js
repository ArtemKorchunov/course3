class DeviceLogs {
  constructor() {}

  logById(ctx) {
    setInterval(
      () => ctx.websocket.send(JSON.stringify({ ddd: 'Hello World' })),
      3000
    );
  }
}

module.exports = new DeviceLogs();
