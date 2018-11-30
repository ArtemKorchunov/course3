const brain = require('brain.js');
const dataset = require('../datasets/temperature.json');
const network = new brain.NeuralNetwork();
class DeviceLogs {
  constructor() {
    network.train(dataset);
  }

  logById(ctx) {
    const timer = setInterval(() => {
      const heat = Math.random() * 100;
      const prediction = network.run([heat]);
      ctx.websocket.send(JSON.stringify({ heat, prediction }));
    }, 3000);
    ctx.websocket.on('message', function (message) {
      if (message.input && message.output) {
        network.train({
          input: message.input,
          output: message.output
        });
      }
    });
    ctx.websocket.onclose = () => {
      clearInterval(timer);
    };
  }
}

module.exports = new DeviceLogs();
