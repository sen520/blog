const router = require('koa-router')();

router.get('/', async (ctx) => {
  ctx.body = 'welcom to my blog';
});


router.get('/json', async (ctx) => {
  ctx.body = {
    title: 'koa2 json',
  };
});

module.exports = router;
