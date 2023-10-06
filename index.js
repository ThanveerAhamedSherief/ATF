const express = require("express");
const server = express();
const logger = require("./utils/logGenerator");
const { connectMongoDb } = require("./db/connection");
const { port } = require("./config/config");
const cors = require("cors");
const router = require("./routes/route");
const { userRouter } = require("./routes/userRouter");
const path = require('path');
const merchantRouter = require("./routes/merchantRoute");

const startServer = () => {
  server.use(cors());
  server.use(express.urlencoded({extended:true}))
  server.use(express.json());
  server.use(router);
  server.use("/api/v1", userRouter);
  server.use('/api/v1/merchant', merchantRouter)
  server.listen(port, async () => {
    console.log(`Server started at ${port}...!`);
    logger.info(`Server started at ${port}...!`);
    await connectMongoDb();
  });
};
startServer();
