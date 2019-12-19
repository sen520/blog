const { promisify } = require('util');
const crypto = require('crypto');
const request = require('request');
const publickIp = require('public-ip');
const { XMLToJSON, JSONToXML, randomString } = require('../static/utility');


class WxPay {
  constructor({ config, signType = 'MD5', useSandBox = false, notifyUrl }) {
    this.config = config;
    this.signType = signType;
    this.useSandBox = useSandBox;
    this.notifyUrl = notifyUrl;
  }

  // eslint-disable-next-line class-methods-use-this
  generateSign(data, key, signType) {
    const keys = Object.keys(data);
    let temp = '';
    // eslint-disable-next-line no-shadow
    keys.sort().forEach((key) => {
      temp += `&${key}=${data[key]}`;
    });
    if (signType === 'MD5') {
      return crypto
        .createHash('MD5')
        .update(`${temp.substr(1)}&key=${key}`)
        .digest('hex')
        .toUpperCase();
    } else {
      return crypto
        .createHmac('sha256', key)
        .update(`${temp.substr(1)}&key=${key}`)
        .digest('hex')
        .toUpperCase();
    }
  }

  async unifiedOrder(reqData) {
    const ip = await publickIp.v4();
    const url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
    const body = { ...reqData };
    body.spbill_create_ip = ip;
    const date = new Date();
    body.out_trade_no = `${date.getUTCFullYear()}${date.getUTCMonth() +
    1}${date.getUTCDate()}`;
    if (this.notifyUrl) {
      body.notify_url = this.notifyUrl;
    }
    const requestBody = this.fillRequestData(body, this.config.key);
    if (this.useSandBox) {
      return this.unifiedOrderSandBox(requestBody);
    }
    const post = promisify(request.post);
    return post({ url, body: JSONToXML(requestBody) })
      .then(response => XMLToJSON(response.body))
      // eslint-disable-next-line no-shadow
      .then(body => body.xml);
  }

  async unifiedOrderSandBox(body) {
    const url = 'https://api.mch.weixin.qq.com/sandboxnew/pay/unifiedorder';
    const sandBoxBody = {
      mch_id: this.config.mchId,
      nonce_str: body.nonce_str,
      sign: body.sign,
    };
    const post = promisify(request.post);
    const keyUrl = 'https://api.mch.weixin.qq.com/sandboxnew/pay/getsignkey';
    const result = await post({ url: keyUrl, body: JSONToXML(sandBoxBody) });
    // eslint-disable-next-line no-param-reassign
    delete body.sign;
    const sign = (await XMLToJSON(result.body)).xml.sandbox_signkey;
    return post({ url, body: JSONToXML(this.fillRequestData(body, sign)) })
      .then(response => XMLToJSON(response.body))
      // eslint-disable-next-line no-shadow
      .then(body => body.xml);
  }

  fillRequestData(data, key) {
    const temp = { ...data };
    temp.appid = this.config.appId;
    temp.mch_id = this.config.mchId;
    temp.nonce_str = randomString({ len: 32 });
    temp.sign_type = this.signType;
    temp.sign = this.generateSign(temp, key, this.signType);
    return temp;
  }
}

class WxPayConfig {
  appId = '';
  key = '';
  mchId = '';

  static fromJSON(json) {
    return new WxPayConfig(json.appId, json.key, json.mchId);
  }

  constructor(appId, key, mchId) {
    this.appId = appId;
    this.key = key;
    this.mchId = mchId;
  }
}

class WxPayCallback {
  // eslint-disable-next-line class-methods-use-this
  async callback({ xml }) {
    const returnCode = xml.result_code[0] === 'SUCCESS' ? 'SUCCESS' : 'FAIL';
    let returnMsg = 'OK';
    if (returnCode !== 'SUCCESS') {
      // eslint-disable-next-line prefer-destructuring
      returnMsg = xml.return_msg[0];
    }
    return `<xml><return_code><![CDATA[${
      returnCode
    }]]></return_code><return_msg><![CDATA[${
      returnMsg
    }]]></return_msg></xml>`;
  }
}

module.exports = {
  WxPay,
  WxPayConfig,
  WxPayCallback,
};
