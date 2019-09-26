const router = require('koa-router')();
const { getPosts, addPost } = require('./index');

router.prefix('/posts');

router.get('/getposts', async (ctx) => {
  await getPosts(ctx.query, ctx);
});

router.post('/addpost', async (ctx) => {
  await addPost(ctx.request.body, ctx);
});

module.exports = router;
