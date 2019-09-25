const router = require('koa-router')();
const { login } = require('../main/user/login');

router.prefix('/users');

router.post('/login', async (ctx, next) => {
  await login(ctx.request.body, ctx);
});

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
});

module.exports = router;
