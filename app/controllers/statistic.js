class Statistic {
  constructor() {}

  async getTemperatureLevelStatistic(ctx) {
    const { device } = ctx.query;
    try {
      const stats = await ctx.models.Sensor.find({
        where: { device_id: device },
        include: [
          {
            model: ctx.models.TemperatureLevel,
            required: true,
            attributes: ['cool', 'medium', 'hight']
          }
        ],
        attributes: []
      });
      return ctx.res.ok({
        data: stats.TemperatureLevel || null
      });
    } catch (err) {
      console.log(err);
    }
  }
  async getMonthStatistic(ctx) {
    const { device } = ctx.query;

    try {
      const stats = await ctx.models.Sensor.findAll({
        where: { device_id: device },
        include: [
          {
            model: ctx.models.MonthStatistic,
            required: true,
            attributes: ['quantity', 'average', 'month_id']
          }
        ],
        attributes: []
      });
      return ctx.res.ok({
        data: stats.map(item => item.MonthStatistic)
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new Statistic();
