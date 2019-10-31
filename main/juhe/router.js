const router = require('koa-router')();
const { getNews, getWeather } = require('./index');

router.prefix('/juhe');

router.get('/news', async (ctx) => {
  await getNews(ctx);
});


router.get('/weather', async (ctx) => {
  await getWeather(ctx);
});
module.exports = router;
