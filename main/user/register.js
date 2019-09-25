const { UserSchema } = require('../static/schema');

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
