const express = require("express");
const { registerUser, login } = require("../controllers/userController");
const userRouter = express.Router();

userRouter.post("/signin", registerUser).post("/login", login).post('/test',(req,res) =>{
    res.status(200).send("its working")
})


exports.userRouter = userRouter;
