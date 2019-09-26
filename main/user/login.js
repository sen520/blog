const { UserSchema } = require('../static/schema');
const bcrypt = require('bcrypt');

/**
 * login
 *
 * @param email {string} user's email
 * @param password {string} user's password
 * @param ctx {object} ctx object
 */
async function login({ email, password }, ctx) {
  const user = await UserSchema.findOne({ email }).select('+password');
  if (!user) {
    ctx.status = 404;
    ctx.body = 'no user';
    return;
  }
  const result = await bcrypt.compare(password, user.password);
  if (result) {
    ctx.body = 'login success';
    return;
  }
  ctx.body = 'error password';
}

module.exports = {
  login,
};
