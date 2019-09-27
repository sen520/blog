const { PostSchema, UserSchema, RelationshipSchema, constant } = require('../static/schema');
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
      posts = await PostSchema.find({ _deleted: false })
        .sort({ _updated: -1 })
        .skip(15 * (page - 1))
        .limit(15);
      if (posts.length === 15) {
        nextUrl = `/posts/getposts?page=${parseInt(page, 10) + 1}`;
      }
    } else {
      const objectId = mongoose.Types.ObjectId;
      const result = await RelationshipSchema.aggregate([
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
  const objectId = mongoose.Types.ObjectId;
  const user = await UserSchema.findOne({ _id: objectId(userId), loginEnable: true });
  if (!user) {
    ctx.body = 'no user';
    ctx.status = 404;
    return;
  }
  const post = new PostSchema({
    title,
    abstract,
    content,
  });
  const result = await post.save();

  const rela = new RelationshipSchema({
    operatorId: userId,
    aimId: result._id,
    type: constant.relationship.type.user_post,
  });
  await rela.save();
  ctx.body = {
    result,
    text: 'add success',
  };
}

/**
 * update posts
 * @param page {number} page you want
 * @param userId {string} userId
 * @param content {object} some info of post
 * @param ctx {object}
 *
 * @returns {Promise<void>}
 */
async function updatePosts({ userId, postId, content }, ctx) {
  try {
    const objectId = mongoose.Types.ObjectId;
    const user = await UserSchema.findOne({ _id: objectId(userId), loginEnable: true });
    if (!user) {
      ctx.body = 'no user';
      ctx.status = 404;
      return;
    }
    await PostSchema.update({ _deleted: false, _id: objectId(postId) }, { $set: content });
    setResult(ctx, 200, 'update post success');
  } catch (e) {
    setError(ctx, e);
  }
}


module.exports = {
  getPosts,
  addPost,
  updatePosts,
};
