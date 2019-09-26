const router = require('koa-router')();


router.get('/', async (ctx) => {
  ctx.body = 'welcom to my test';
});

module.exports = router;
