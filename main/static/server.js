const config = require('../../config.json');


const mongoose = require('mongoose');

const mongoOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 1000, // Reconnect every 1000ms

};

mongoose.connect(config.mongodb, mongoOptions);





module.exports = {
  mongoose,
};
