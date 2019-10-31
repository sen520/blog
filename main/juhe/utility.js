const fetch = require('node-fetch');
const { setError } = require('../static/utility');

/**
 * get data
 * @param ctx {object}
 * @param url {string}
 *
 * @returns {Promise<void>}
 */
/* eslint-disable compat/compat */
async function juheData(ctx, url) {
  const response = await fetch(url);
  const result = await response.json();
  if (result.error_code !== 0) {
    setError(ctx, { name: 'fetch error', message: result.reason });
    return;
  }
  return result;
}

module.exports = {
  juheData,
};
