const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  mongourl: process.env.MONGOURL,
  port: process.env.PORT,
  secretkey: process.env.SECRET_KEY,
  default_email:process.env.DEFAULT_GMAIL,
  default_password:process.env.DEFAULT_PASSWORD

};
