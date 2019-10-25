const router = require('koa-router')();


router.get('/', async (ctx) => {
  ctx.body = 'welcom to my blog';
});

router.get('/music', async (ctx) => {
  ctx.body = 'welcom to my blog';
});

module.exports = router;
