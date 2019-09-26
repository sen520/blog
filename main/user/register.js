const { UserSchema } = require('../static/schema');

/**
 * register
 *
 * @param username {string}
 * @param password {string}
 * @param email {string}
 * @param headerimage {href} the link of user's headerimage
 * @param ctx {object}
 *
 * @returns {Promise<void>}
 */
async function register({ username, password, email, headerimage }, ctx) {
  const user = new UserSchema({
    name: username,
    email,
    password,
    headerImage: headerimage,
  });
  try {
    await user.save();
    ctx.body = 'register success';
  } catch (e) {
    ctx.body = 'user is already exist';
  }
}

module.exports = {
  register,
};
