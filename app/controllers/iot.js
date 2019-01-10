// const config = require('../config');
const uuidv4 = require('uuid/v4');
const brain = require('brain.js');

const dataset = require('../datasets/temperature.json');
const network = new brain.NeuralNetwork();
class IoT {
  constructor() {
    network.train(dataset);
  }

  async getSensors(ctx) {
    try {
      const sensors = await ctx.models.Sensor.findAll({
        where: { device_id: null },
        attributes: ['id', 'name']
      });
      return ctx.res.ok({
        data: sensors
      });
    } catch (err) {
      console.log(err);
    }
  }

  getLoggerInfo(ctx) {
    const { heat } = ctx.query;
    const prediction = network.run([heat]);
    ctx.io
      .of('/device')
      .to(`device_${ctx.query.identifier}`)
      .emit('payload', { heat, prediction });

    this.analyzeTemperatureLevel(
      +heat,
      ctx.query.id,
      ctx.models.TemperatureLevel
    );
    this.analyzeMonthStatistic(+heat, ctx.query.id, ctx.models.MonthStatistic);

    ctx.res.ok();
  }

  async analyzeTemperatureLevel(heat, id, TemperatureLevel) {
    const tempLevelResult = await TemperatureLevel.findOrCreate({
      where: { sensor_id: id },
      defaults: this.setTemperatureLevels(heat)
    });
    if (tempLevelResult.pop() !== true) {
      // TODO pass to setTemperatureLevels only required fields
      await tempLevelResult[0].update(
        this.setTemperatureLevels(heat, tempLevelResult[0])
      );
    }
  }
  setTemperatureLevels(heat, values = { cool: 0, medium: 0, hight: 0 }) {
    switch (true) {
      case heat < 10:
        return { ...values, cool: values.cool + 1 };
      case heat < 50:
        return { ...values, medium: values.medium + 1 };
      default:
        return { ...values, hight: values.hight + 1 };
    }
  }

  async analyzeMonthStatistic(heat, id, MonthStatistic) {
    const currentMonth = new Date().getMonth();

    const monthStatisticResult = await MonthStatistic.findOrCreate({
      where: { sensor_id: id, month_id: +currentMonth + 1 },
      defaults: { quantity: 1, average: +heat, month_id: +currentMonth }
    });
    if (monthStatisticResult.pop() !== true) {
      const currentStatistic = monthStatisticResult[0];
      const { quantity, average } = currentStatistic;

      const sumStatiticTemperature = quantity * average;

      await monthStatisticResult[0].update({
        quantity: quantity + 1,
        average: (sumStatiticTemperature + heat) / (quantity + 1)
      });
    }
  }

  async iotAuth(ctx) {
    // Current logic
    const { name, identifier = null } = ctx.request.body;
    let currentIdentifier;

    if (identifier) currentIdentifier = identifier;
    else currentIdentifier = uuidv4();

    try {
      let currentSensor;
      currentSensor = await ctx.models.Sensor.findOne({
        where: {
          identifier: currentIdentifier
        }
      });
      if (!currentSensor) {
        currentSensor = await ctx.models.Sensor.create({
          identifier: currentIdentifier,
          name
        });
      }
      ctx.res.created({
        data: { identifier: currentIdentifier, id: currentSensor.id }
      });
    } catch ({ errors }) {
      return ctx.res.unprocessableEntity({
        data: errors.reduce(
          (prevItem, item) => ({ ...prevItem, [item.path]: item.message }),
          {}
        ),
        message: 'Unprocessable entity!'
      });
    }
  }
}

module.exports = new IoT();
