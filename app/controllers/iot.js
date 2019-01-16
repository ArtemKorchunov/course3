// const config = require('../config');
const uuidv4 = require('uuid/v4');
const brain = require('brain.js');
const nodemailer = require('nodemailer');
const config = require('../config');

const dataset = require('../datasets/temperature.json');
const network = new brain.NeuralNetwork();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: config.gmailAuth,
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false
});

class IoT {
  constructor() {
    network.train(
      dataset.map(item => ({ ...item, input: [item.input[0] / 10000] }))
    );
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

  async getLoggerInfo(ctx) {
    const { heat, identifier, id } = ctx.query;
    const convertedHeat = +heat;
    const prediction = network.run([convertedHeat / 10000]);

    ctx.io
      .of('/device')
      .to(`device_${identifier}`)
      .emit('payload', { heat, prediction });

    this.analyzeTemperatureLevel(
      convertedHeat,
      id,
      ctx.models.TemperatureLevel
    );
    this.analyzeMonthStatistic(convertedHeat, id, ctx.models.MonthStatistic);
    if (prediction[0] < 0.55)
      this.sendEmailNotification(ctx.models, identifier, convertedHeat);

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
      defaults: { quantity: 1, average: +heat, month_id: +currentMonth + 1 }
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

  async sendEmailNotification(models, identifier, heat) {
    try {
      const sensor = await models.Sensor.findOne({
        where: { identifier },
        include: [
          {
            model: models.Device,
            required: true,
            attributes: ['user_id', 'name']
          }
        ]
      });
      const user = await models.User.findById(sensor.Device.user_id);
      const mailOptions = {
        from: config.gmailAuth.user,
        to: user.email,
        subject: 'Notification',
        text: `There is danger for your device ${
          sensor.Device.name
        }, please keep looking for it state, current temperature is ${heat} ℃ !`
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) console.log(error);
        else console.log('Email sent: ' + info.response);
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new IoT();
