const router = require('koa-router')();
const { login } = require('./login');
const { register } = require('./register');
const { updateUserInfo } = require('./userInfo');

router.prefix('/users');

router.post('/login', async (ctx) => {
  await login(ctx.request.body, ctx);
});

router.post('/register', async (ctx) => {
  await register(ctx.request.body, ctx);
});

router.post('/update', async (ctx) => {
  await updateUserInfo(ctx.request.body, ctx);
});

module.exports = router;
