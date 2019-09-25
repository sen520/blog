const router = require('koa-router')();
const { login } = require('./login');
const { register } = require('./register');

router.prefix('/users');

router.post('/login', async (ctx) => {
  await login(ctx.request.body, ctx);
});

router.post('/register', async (ctx) => {
  await register(ctx.request.body, ctx);
});

module.exports = router;
