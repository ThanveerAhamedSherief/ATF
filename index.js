const express = require("express");
const server = express();
const dotenv = require("dotenv");
const logger = require("./utils/logGenerator");
const { connectMongoDb } = require("./db/connection");
const { port, mongourl } = require("./config/config");
const cors = require("cors");
const router = require("./routes/route");
const { userRouter } = require("./routes/userRouter");

const startServer = () => {
  dotenv.config();
  server.use(cors());
  server.use(express.json());
  server.use(router);
  server.use("/api/v1", userRouter);
  server.listen(port, async () => {
    console.log(`Server started at ${port}...!`);
    logger.info("Server started...!");
    await connectMongoDb();
  });
};
startServer();
