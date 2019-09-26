const bcrypt = require('bcrypt');
const { UserSchema } = require('../static/schema');
const { setError, setResult } = require('../static/utility');

/**
 * update user info
 *
 * @param info
 * @param ctx
 * @returns {Promise<void>}
 */
/* eslint-disable no-underscore-dangle, no-param-reassign */
async function updateUserInfo(info, ctx) {
  try {
    const userId = info._id;
    const result = await UserSchema.findOne({ _id: userId });
    if (!result) {
      setResult(ctx, 404, 'no such user');
      return;
    }
    delete info._id;
    delete info.password;
    delete info.email;
    await UserSchema.update({ _id: userId }, { $set: info });
    setResult(ctx, 200, 'update user info success');
  } catch (e) {
    setError(ctx, e);
  }
}

/**
 * update user info
 *
 * @param oldPassword {string}
 * @param newPassword {string}
 * @param email {string}
 * @param ctx {object}
 *
 * @returns {Promise<void>}
 */
async function resetPassword({ oldPassword, newPassword, email }, ctx) {
  const user = await UserSchema.findOne({ email, loginEnable: true }).select('+password');
  if (!user) {
    setResult(ctx, 404, 'no such user');
    return;
  }
  const result = await bcrypt.compare(oldPassword, user.password);
  if (!result) {
    setResult(ctx, 404, 'error password');
    return;
  }
  user.password = newPassword;
  user.save();
  setResult(ctx, 200, 'update password success');
}

module.exports = {
  updateUserInfo,
  resetPassword,
};
