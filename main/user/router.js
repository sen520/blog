const router = require('koa-router')();
const { login } = require('./login');
const { register } = require('./register');
const { updateUserInfo, resetPassword } = require('./userInfo');

router.prefix('/users');

router.post('/login', async (ctx) => {
  console.log('/login', ctx.request.body);
  await login(ctx.request.body, ctx);
});

router.post('/register', async (ctx) => {
  console.log('/register', ctx.request.body);
  await register(ctx.request.body, ctx);
});

router.post('/update', async (ctx) => {
  console.log('/update', ctx.request.body);
  await updateUserInfo(ctx.request.body, ctx);
});

router.post('/reset/password', async (ctx) => {
  console.log('/reset/password', ctx.request.body);
  await resetPassword(ctx.request.body, ctx);
});

module.exports = router;
