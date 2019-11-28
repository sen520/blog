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
    const user = new ImageSchema({
      name, url,
    });
    await user.save();
  },
});
// 加载配置
const upload = multer({ storage });
router.post('/upload', upload.single('file'), async (ctx) => {
  const { filename } = ctx.req.file;
  ctx.body = {
    filename: `/uploads/${filename}`,
  };
});

module.exports = router;
