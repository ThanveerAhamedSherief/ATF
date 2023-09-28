const { mongourl } = require("../config/config");
const logger = require("../utils/logGenerator");
const mongoose = require("mongoose");

module.exports.connectMongoDb = async () => {
  try {
    console.log("url", mongourl);
    await mongoose.connect(mongourl);
    logger.info("MongoDb connected successfully..!");
  } catch (error) {
    logger.error("Error while connecting to mongodb", error);
    return false;
  }
};
