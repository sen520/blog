const router = require('koa-router')();
const { getPosts, addPost, updatePosts } = require('./index');

router.prefix('/posts');

router.get('/getposts', async (ctx) => {
  await getPosts(ctx.query, ctx);
});

router.post('/addpost', async (ctx) => {
  await addPost(ctx.request.body, ctx);
});

router.post('/updatepost', async (ctx) => {
  await updatePosts(ctx.request.body, ctx);
});

module.exports = router;
