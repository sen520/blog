const { PostSchema } = require('../static/schema');

/**
 * get posts
 * @param page {number} page you want
 * @param ctx {object}
 *
 * @returns {Promise<void>}
 */
async function getPosts({ page }, ctx) {
  const posts = await PostSchema.find({})
    .sort({ _updated: -1 })
    .skip(15 * (page - 1))
    .limit(15);
  ctx.body = {
    posts,
  };
}

/**
 * add post
 *
 * @param title {string}
 * @param abstract {string}
 * @param content {text}
 * @param ctx {object}
 *
 * @returns {Promise<void>}
 */
async function addPost({ title, abstract, content }, ctx) {
  const post = new PostSchema({
    title,
    abstract,
    content,
  });
  const result = await post.save();
  ctx.body = {
    result,
    text: 'add success',
  };
}

module.exports = {
  getPosts,
  addPost,
};
