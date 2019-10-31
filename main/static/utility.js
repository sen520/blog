const setError = (ctx, e) => {
  console.error(e.name);
  console.error(e.message);
  ctx.body = { message: e.message };
  ctx.status = 500;
};

const setResult = (ctx, code, body) => {
  ctx.status = code;
  ctx.body = body;
};

/**
 * format Url Params
 *
 * @param params
 */
const formatUrlParams = (params) => {
  if (typeof params === 'string') {
    return encodeURIComponent(params);
  }
  return encodeURIComponent(JSON.stringify(params));
};

module.exports = {
  setResult,
  setError,
  formatUrlParams,
};
