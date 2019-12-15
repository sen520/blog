const router = require('koa-router')();
const multer = require('koa-multer');
const path = require('path');
const fs = require('fs');
const { ImageSchema } = require('../main/static/schema');
const { promisify } = require('util');

router.get('/', async (ctx) => {
  ctx.body = 'welcom to my blog';
});

// router.post('/upload', async (ctx) => {
//   console.log(ctx.request.body);
// });

router.get('/read/dir', async (ctx) => {
  const fsDir = promisify(fs.readdir);
  const result = await fsDir('./static/uploads');
  console.log(result);
  const dir = result.filter((t) => {
    const stat = fs.lstatSync(`./static/uploads/${t}`);
    return stat.isDirectory();
  });
  ctx.body = dir;
});


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
router.post('/upload', upload.single('file'), async (ctx) => {
  const { dir } = ctx.req.body;
  const { filename } = ctx.req.file;
  const url = `http://silencew.cn/uploads/${dir}/${filename}`;
  let origin = 'silencew.cn';
  if (ctx.req.headers.host !== 'silencew.cn') {
    origin = 'localhost';
  }
  const user = new ImageSchema({
    name: filename, url, origin,
  });
  await user.save();
  fs.rename(`static/uploads/${filename}`, `static/uploads/${dir}/${filename}`, (err) => {
    if (err) {
      ctx.body = {
        error: '操作失败',
      };
    } else {
      console.log('重命名成功！');
    }
  });

  ctx.body = {
    filename: `/uploads/${dir}/${filename}`,
  };
});

module.exports = router;
