const xml2js = require('xml2js');
const fetch = require('node-fetch');

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

/**
 * 生成随机数
 * @param len {Number} 生成随机数的长度
 * @returns {string}
 */
function randomString({ len }) {
  // eslint-disable-next-line no-param-reassign
  len = len || 32;
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const maxPos = $chars.length;
  let pwd = '';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

function JSONToXML(data) {
  return new xml2js.Builder().buildObject(data);
}

function XMLToJSON(xml) {
  return new xml2js.Parser({
    explicitArray: false,
    ignoreAttrs: true,
  }).parseStringPromise(xml);
}

/**
 * 返回xml信息转json
 * @param body {Object}发送的信息
 * @param fetchUrl {String}发送的地址
 * @returns {Promise<object>}
 */
async function xmlFetch(body, fetchUrl) {
  const fetchBody = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSONToXML(body),
  };
  // eslint-disable-next-line compat/compat
  const fetchResult = await fetch(fetchUrl, fetchBody);
  const result = await fetchResult.text();
  return XMLToJSON(result);
}

module.exports = {
  setResult,
  setError,
  formatUrlParams,
  getClientIP,
  JSONToXML,
  XMLToJSON,
  xmlFetch,
  randomString,
};
