const router = require('koa-router')();
const multer = require('koa-multer');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const mysql = require('mysql2');
const config = require('../config.json');
const { ImageSchema } = require('../main/static/schema');

router.get('/', async (ctx) => {
  ctx.body = 'welcom to my blog';
});

// router.post('/upload', async (ctx) => {
//   console.log(ctx.request.body);
// });

// 获取文件夹
router.get('/read/dir', async (ctx) => {
  const fsDir = promisify(fs.readdir);
  const result = await fsDir('./static/uploads');
  const dir = result.filter((t) => {
    const stat = fs.lstatSync(`./static/uploads/${t}`);
    return stat.isDirectory();
  });
  ctx.body = dir;
});

// 设置文件上传配置
const limits = {
  fields: 10, // 非文件字段的数量
  fileSize: 20 * 1024 * 1024, // 文件大小 单位 b
  files: 20, // 文件数量
};
const storage = multer.diskStorage({
  // 文件保存路径
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../static', 'uploads'));
  },
  // 修改文件名称
  filename: async (req, file, cb) => {
    const fileFormat = (file.originalname).split('.');// 以点分割成数组，数组的最后一项就是后缀名
    const name = `${Date.now()}.${fileFormat[fileFormat.length - 1]}`;

    cb(null, name);
  },
});
// 加载配置
const upload = multer({ storage, limits });
// 文件上传，保存数据至服务器
router.post('/upload', upload.single('file'), async (ctx) => {
  const { dir } = ctx.req.body;
  const { filename } = ctx.req.file;
  const url = `http://silencew.cn/uploads/${dir}/${filename}`;
  let origin = 'project_backend:3000';
  if (ctx.req.headers.host !== 'project_backend:3000') {
    origin = 'localhost';
  }

  const rename = promisify(fs.rename);
  const error = await rename(`static/uploads/${filename}`, `static/uploads/${dir}/${filename}`);
  if (error) {
    ctx.body = {
      error: '操作失败',
    };
    return;
  }
  const user = new ImageSchema({
    name: filename, url, origin,
  });
  await user.save();
  const connection = mysql.createConnection(config.mySQL);
  const sql = 'INSERT INTO images(id, name, url, created, updated, origin) VALUES(0, ?, ?, ?, ?, ?)';
  const params = [filename, url, new Date(), new Date(), origin];
  const [rows] = await connection.promise().query(sql, params);
  console.log(rows.insertId);
  connection.close();
  ctx.body = {
    filename: `/uploads/${dir}/${filename}`,
  };
});

router.post('/test', async (ctx) => {
  console.log(ctx.request.body);
  ctx.body = 'get';
});

// router.get('/pan', async (ctx) => {
//   const fsDir = promisify(fs.readdir);
//   const result = await fsDir('./static/uploads');
//   let html = '';
//   for (const file of result) {
//     html += `${file}\n`;
//   }
//   ctx.body = html;
// });

module.exports = router;
