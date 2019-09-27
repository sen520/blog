const router = require('koa-router')();
const { getPosts, addPost, updatePosts } = require('./index');

router.prefix('/posts');

router.get('/get', async (ctx) => {
  await getPosts(ctx.query, ctx);
});

router.post('/add', async (ctx) => {
  await addPost(ctx.request.body, ctx);
});

router.post('/update', async (ctx) => {
  await updatePosts(ctx.request.body, ctx);
});

module.exports = router;
