const config = require('../../config.json');

const mongoClient = require('mongodb').MongoClient;

const mongoOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 1000, // Reconnect every 1000ms

};

const mongo = mongoClient.connect(config.mongodb, mongoOptions);

module.exports = {
  mongo,
};
