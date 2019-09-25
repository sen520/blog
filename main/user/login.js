const { mongo } = require('../static/server');

async function login({ username, password }, ctx) {
  const db = (await mongo).db('data');
  await db.collection('user').insert({ username, password });
  const res = await db.collection('user').findOne({ username, password });
  console.log(res);
  ctx.body = 'login success';
}

module.exports = {
  login,
};
