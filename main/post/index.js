const { PostSchema, UserSchema, Relationship } = require('../static/schema');
const { mongoose } = require('../static/server');
const { setError, setResult } = require('../static/utility');

/**
 * get posts
 * @param page {number} page you want
 * @param userId {string} userId
 * @param ctx {object}
 *
 * @returns {Promise<void>}
 */
async function getPosts({ page = 1, userId }, ctx) {
  try {
    let posts = null;
    let nextUrl = null;
    if (!userId) {
      posts = await PostSchema.find({})
        .sort({ _updated: -1 })
        .skip(15 * (page - 1))
        .limit(15);
      if (posts.length === 15) {
        nextUrl = `/posts/getposts?page=${parseInt(page, 10) + 1}`;
      }
    } else {
      const objectId = mongoose.Types.ObjectId;
      const result = await Relationship.aggregate([
        { $match: { operatorId: objectId(userId) } },
        { $lookup: { from: 'posts', localField: 'aimId', foreignField: '_id', as: 'posts' } },
        { $unwind: '$posts' },
        { $project: { operatorId: 1, _id: 0, posts: 1 } },
        { $skip: 15 * (page - 1) },
        { $limit: 15 },
      ]);
      posts = result.map(r => r.posts);
      if (posts.length === 15) {
        nextUrl = `/posts/getposts?page=${parseInt(page, 10) + 1}&userId=${userId}`;
      }
    }
    setResult(ctx, 200, { posts, nextUrl });
  } catch (e) {
    setError(ctx, e);
  }
}

/**
 * add post
 *
 * @param userId {string}
 * @param title {string}
 * @param abstract {string}
 * @param content {text}
 * @param ctx {object}
 *
 * @returns {Promise<void>}
 */
/* eslint-disable no-underscore-dangle */
async function addPost({ userId, title, abstract, content }, ctx) {
  const user = await UserSchema.findOne({ _id: userId });
  if (!user) {
    ctx.body = 'no user';
    ctx.status = 404;
  }
  const post = new PostSchema({
    title,
    abstract,
    content,
  });
  const result = await post.save();

  const rela = new Relationship({
    operatorId: userId,
    aimId: result._id,
  });
  await rela.save();
  ctx.body = {
    result,
    text: 'add success',
  };
}

module.exports = {
  getPosts,
  addPost,
};
