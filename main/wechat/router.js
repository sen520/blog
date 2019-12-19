const router = require('koa-router')();
const { throwErrorResponse } = require('../../utility');
const { WxPay, WxPayConfig, WxPayCallback } = require('./wechat');
const { host, wechat } = require('../static/static');

router.prefix('/wechat');

// 微信配置
const Wxconfig = WxPayConfig.fromJSON({
  appId: wechat.pay.appId,
  key: wechat.pay.key,
  mchId: wechat.pay.mchId,
});

// 微信支付沙箱测试
router.post('/wechatpay-sandBox', async (ctx) => {
  try {
    const wxPay = new WxPay({
      config: Wxconfig,
      signType: 'MD5',
      useSandBox: true,
      notifyUrl: `${host}/wechatpay-callback`,
    });
    const { body } = ctx.request.body;
    ctx.body = await wxPay.unifiedOrder({
      body,
      total_fee: 101,
      trade_type: 'NATIVE',
    });
  } catch (e) {
    console.error(e);
    throwErrorResponse(ctx, e);
  }
});

// 微信支付
router.post('/wechatpay', async (ctx) => {
  try {
    const wxPay = new WxPay({
      config: Wxconfig,
      signType: 'MD5',
      useSandBox: false,
      notifyUrl: `${host}/wechatpay-callback`,
    });
    const { body, totalFee } = ctx.request.body;
    ctx.body = await wxPay.unifiedOrder({
      body,
      total_fee: parseFloat(totalFee, 10) * 100,
      trade_type: 'NATIVE',
    });
  } catch (e) {
    console.error(e);
    throwErrorResponse(ctx, e);
  }
});

// 微信支付callback
router.post('/wechatpay-callback', async (ctx) => {
  try {
    const { xml } = ctx.request.body;
    const wxPayCallback = new WxPayCallback();
    ctx.body = await wxPayCallback.callback({ xml });
  } catch (e) {
    console.error(e);
    throwErrorResponse(ctx, e);
  }
});

module.exports = router;
