const setError = (ctx, e) => {
  console.error(e.name);
  console.error(e.message);
  ctx.body = e.name;
  ctx.status = 500;
};

const setResult = (ctx, code, body) => {
  ctx.status = code;
  ctx.body = body;
};

module.exports = {
  setResult,
  setError,
};
