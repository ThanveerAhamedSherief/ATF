const { secretkey } = require("../config/config");
const { User } = require("../models/User");
const { customizeResponse } = require("../utils/customResponse");
const logger = require("../utils/logGenerator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    let { email, password, username } = req.body;
    if (!(email && password && username)) {
      return res
        .status(401)
        .json(customizeResponse(false, "All fields are mandatory..!"));
    }
    let isExistingUser = await User.findOne({ email });
    if (isExistingUser) {
      return res
        .status(401)
        .json(customizeResponse(false, "User already exists"));
    }
    let salt = await bcrypt.genSalt(10);
    let encryptPassword = await bcrypt.hash(password, salt);
    let createAdminUser = new User({
      email,
      password: encryptPassword,
      username,
    });
    let newUser = await createAdminUser.save();
    let response = {
      email: newUser.email,
      username: newUser.username,
      id: newUser.id,
    };
    res
      .status(201)
      .json(customizeResponse(true, "New user Added successfully", response));
  } catch (error) {
    logger.error("Error while registering a user", error);
    res
      .status(400)
      .json(customizeResponse(false, "Error while registering an user", error));
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!(email && password)) {
      return res
        .status(401)
        .json(customizeResponse(false, "All fields are mandatory..!"));
    }
    let existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(401)
        .json(customizeResponse(false, "User doesn't exists..!"));
    }
    let isValidPassword = await bcrypt.compare(password, existingUser.password);
    if (!isValidPassword) {
      return res
        .status(401)
        .json(customizeResponse(false, "Invalid email or password..!"));
    }
    let token = jwt.sign(
      { id: existingUser._id, email, role: existingUser.role },
      secretkey,
      { expiresIn: "1m" }
    );
    res.set("token", token);
    let finalResponse = {
      email,
      username: existingUser.username,
    };
    res
      .status(200)
      .json(customizeResponse(true, "Login successfull", finalResponse));
  } catch (error) {
    logger.error("Error while connecting to mongodb", error);
    res.status(400).json(customizeResponse(false, "Error while login", error));
  }
};
