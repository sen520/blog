const router = require('koa-router')();
const multer = require('koa-multer');
const path = require('path');
const { ImageSchema } = require('../main/static/schema');

router.get('/', async (ctx) => {
  ctx.body = 'welcom to my blog';
});

// router.post('/upload', async (ctx) => {
//   console.log(ctx.request.body);
// });

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
    const url = `http://silencew.cn/uploads/${name}`;
    cb(null, name);
    let origin = 'silencew.cn';
    if (req.headers.host !== 'silencew.cn') {
      origin = 'localhost';
    }
    const user = new ImageSchema({
      name, url, origin,
    });
    await user.save();
  },
});
// 加载配置
const upload = multer({ storage, limits });
router.post('/upload', upload.single('file'), async (ctx) => {
  const { filename } = ctx.req.file;
  ctx.body = {
    filename: `/uploads/${filename}`,
  };
});

module.exports = router;
