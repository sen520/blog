const { UserSchema } = require('../static/schema');
const { setError, setResult } = require('../static/utility');

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
  try {
    const user = new UserSchema({
      name: username,
      email,
      password,
      headerImage: headerimage,
    });
    try {
      await user.save();
      setResult(ctx, 200, 'register success');
    } catch (e) {
      setResult(ctx, 405, 'user is already exist');
    }
  } catch (e) {
    setError(ctx, e);
  }
}

module.exports = {
  register,
};
