const config = require('../../config.json');
const mysql = require('mysql2');

const mongoose = require('mongoose');

const mongoOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 1000, // Reconnect every 1000ms
  useCreateIndex: true,
};
mongoose.connect(config.mongodb, mongoOptions);

const connection = mysql.createConnection(config.mySQL);

module.exports = {
  mongoose,
  connection,
};
