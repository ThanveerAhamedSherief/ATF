const express = require("express");
const { registerUser, login } = require("../controllers/userController");
const userRouter = express.Router();

userRouter.post("/signin", registerUser).post("/login", login);

exports.userRouter = userRouter;
