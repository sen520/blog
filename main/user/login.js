const { UserSchema } = require('../static/schema');
const bcrypt = require('bcrypt');
const { setError, setResult } = require('../static/utility');

/**
 * login
 *
 * @param email {string} user's email
 * @param password {string} user's password
 * @param ctx {object} ctx object
 */
async function login({ email, password }, ctx) {
  try {
    const user = await UserSchema.findOne({ email }).select('+password');
    if (!user) {
      setResult(ctx, 404, 'no such user');
      return;
    }
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      setResult(ctx, 200, 'login success');
      return;
    }
    setResult(ctx, 405, 'error password');
  } catch (e) {
    setError(ctx, e);
  }
}

module.exports = {
  login,
};
