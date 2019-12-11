const data = {};

function isDateOvertimed(date, seconds) {
  const overtime = new Date();
  overtime.setSeconds(date.getSeconds() + seconds);
  return new Date() > overtime;
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

module.exports = opFrequencyTest;
