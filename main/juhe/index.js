const { setError, formatUrlParams, setResult } = require('../static/utility');
const { juhe } = require('../static/static');
const { juheData } = require('./utility');

/**
 * get news
 * @param ctx {object}
 */
async function getNews(ctx) {
  try {
    const url = `http://v.juhe.cn/toutiao/index?type=top&key=${juhe.news}`;
    const result = await juheData(ctx, url);
    setResult(ctx, 200, { data: result.result.data });
  } catch (e) {
    setError(ctx, e);
  }
}

/**
 * get weather
 * @param ctx {object}
 */
async function getWeather(ctx) {
  try {
    const url = `http://apis.juhe.cn/simpleWeather/query?city=${formatUrlParams(ctx.query.city)}&key=${juhe.weather}`;
    const result = await juheData(ctx, url);
    if (result) {
      setResult(ctx, 200, { data: result.result });
    }
  } catch (e) {
    setError(ctx, e);
  }
}

module.exports = {
  getNews,
  getWeather,
};
