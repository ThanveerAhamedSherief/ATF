const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  mongourl: process.env.MONGOURL,
  port: process.env.PORT,
  secretkey: process.env.SECRET_KEY,
};
