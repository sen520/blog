const router = require('koa-router')();
const { getPosts, addPost, updatePosts, addComment, deletePosts } = require('./index');

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

router.post('/delete', async (ctx) => {
  await deletePosts(ctx.request.body, ctx);
});

router.post('/addcomment', async (ctx) => {
  await addComment(ctx.request.body, ctx);
});


module.exports = router;
