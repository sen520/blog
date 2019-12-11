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

/**
 * @getClientIP
 * @desc 获取用户 ip 地址
 * @param {Object} req - 请求
 */
function getClientIP(req) {
  return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
      req.connection.remoteAddress || // 判断 connection 的远程 IP
      req.socket.remoteAddress || // 判断后端的 socket 的 IP
      req.connection.socket.remoteAddress;
}

module.exports = {
  setResult,
  setError,
  formatUrlParams,
  getClientIP,
};
