const Koa = require('koa');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const path = require('path');
const xmlParser = require('koa-xml-parser');
const staticFile = require('koa-static');

const app = new Koa();

app.use(staticFile(path.join(__dirname, './static')));

const index = require('./routes/index');
const users = require('./main/user/router');
const posts = require('./main/post/router');
const juhes = require('./main/juhe/router');

// error handler
onerror(app);

// middlewares
const parseXML = xmlParser({
  limit: '1MB', // Reject payloads larger than 1 MB
  encoding: 'UTF-8', // Explicitly set UTF-8 encoding
  xml: {
    normalize: true, // Trim whitespace inside text nodes
    normalizeTags: true, // Transform tags to lowercase
    explicitArray: false, // Only put nodes in array if >1
  },
});

app.use(parseXML);

app.use(bodyparser({
  enableTypes: ['json', 'form', 'text'],
}));
app.use(json());
app.use(logger(async (ctx) => {
  console.log(decodeURI(ctx));
}));


// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(posts.routes(), posts.allowedMethods());
app.use(juhes.routes(), juhes.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});


module.exports = app;
