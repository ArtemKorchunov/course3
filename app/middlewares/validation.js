function validateBody(validateByRules, options = {}) {
  return async (ctx, next) => {
    const {
      message = 'Unprocessable entity!',
      type = 'unprocessableEntity'
    } = options;
    validateByRules(ctx);
    if (ctx.errors) {
      return ctx.res[type]({
        data: ctx.errors.reduce(
          (prevItem, item) => ({ ...prevItem, ...item }),
          {}
        ),
        message
      });
    }
    await next();
  };
}

module.exports = validateBody;
