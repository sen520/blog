const data = {};

function isDateOvertimed(date, seconds) {
  return new Date().getTime() > date.getTime() + seconds * 1000;
}

function cleanData() {
  Object.keys(data).forEach((operationKey) => {
    const { date, seconds } = data[operationKey];
    if (isDateOvertimed(date, seconds)) {
      delete data[operationKey];
    }
  });
}

/**
 * 测试是否为一个低频操作
 * @param {string} operationKey 操作标识符
 * @param {number} seconds 一定秒数内
 * @param {number} count 一定次数
 * @returns {boolean}
 */
function opFrequencyTest(operationKey, seconds, count) {
  if (Math.random() < 0.001) cleanData();
  const item = data[operationKey];
  if (!item) {
    data[operationKey] = {
      seconds,
      count: 0,
      date: new Date(),
    };
  } else {
    item.count += 1;

    if (!isDateOvertimed(item.date, seconds)) {
      if (item.count > count) {
        return false;
      }
    } else {
      Object.assign(item, {
        seconds,
        count: 0,
        date: new Date(),
      });
    }
  }
  return true;
}

/**
 * 注入错误反馈响应
 * @param {*} ctx
 * @param {Error} error
 */
function throwErrorResponse(ctx, error) {
  const { message } = error;
  if (message) {
    try {
      const { status, error: errorParsed } = JSON.parse(message);
      ctx.status = status;
      ctx.body = {
        status,
        error: errorParsed,
      };
    } catch {
      ctx.status = 500;
      ctx.body = {
        status: 500,
        error: {
          code: -1,
          message,
        },
      };
    }
  } else {
    ctx.status = 500;
    ctx.body = {
      status: 500,
      error: {
        code: -1,
        message: 'Internal Server Error',
      },
    };
  }
}

module.exports = {
  opFrequencyTest,
  throwErrorResponse
};
