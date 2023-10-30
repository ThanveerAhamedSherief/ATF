const { planDetailsSchema } = require("../models/merchant/merchantPlanDetails");
const { merchantsSchema } = require("../models/merchant/merchantSchema");
const { customizeResponse } = require("../utils/customResponse");
const logger = require("../utils/logGenerator");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { merchantAddress } = require("../models/merchant/merchantAddressSchema");
const { secretkey } = require("../config/config");
const { mailer } = require("../services/mailer");

exports.merchantRegister = async (req, res) => {
  try {
    logger.info("merchantController - Register the merchant");
    let {
      firstname,
      lastname,
      username,
      storename,
      email,
      mobileNumber,
      alternativeMobileNumber,
      website,
      instagramLink,
      facebookLink,
      twitterLink,
      addresses,
      customerStatus,
      password,
      isMultipleLocatedStore,
      customerSelectedPlanDetails,
      isActive,
      gstNo,
      token,
      planDetails,
    } = req.body;
    if (!(firstname && lastname && mobileNumber && password)) {
      logger.error("Some mandatory fields are missing");
      return res
        .status(400)
        .json(customizeResponse(false, "Please fill all mandatory fields"));
    }
    let newAddress = null;
    if (addresses) {
      newAddress = await merchantAddress.create(addresses);
    }
    let newPlan = await planDetailsSchema.create(planDetails);
    let salt = await bcrypt.genSalt(10);
    let encryptedPassword = await bcrypt.hash(password, salt);
    let newCustomer = new merchantsSchema({
      firstname,
      lastname,
      username,
      email,
      storename,
      profilePicture: req.file
        ? {
            data: fs.readFileSync("public/uploads/" + req.file.filename),
            contentType: req.file.filename.includes("png")
              ? "image/png"
              : req.file.filename.includes("jpg")
              ? "image/jpg"
              : "unknown",
          }
        : "",
      mobileNumber,
      alternativeMobileNumber,
      website,
      instagramLink,
      facebookLink,
      twitterLink,
      addresses: newAddress != null ? newAddress[0]._id : [],
      customerStatus,
      password: encryptedPassword,
      isMultipleLocatedStore,
      customerSelectedPlanDetails,
      isActive,
      planDetails: newPlan._id,
      gstNo,
      token,
      createdOn: Date.now(),
      lastModifiedOn: Date.now(),
    });
    let createNewCustomer = await newCustomer.save();
    planDetails.merchantId = createNewCustomer.id;
    mailer({email,username})
    res
      .status(201)
      .json(
        customizeResponse(
          true,
          "Customer created successfully",
          createNewCustomer
        )
      );
  } catch (error) {
    logger.error("Error while registering a customer", error);
    res
      .status(400)
      .json(
        customizeResponse(false, "Error while registering an customer", error)
      );
  }
};
exports.merchants = async (req, res) => {
  try {
    let merchantsList = await merchantsSchema
      .find({})
      .select("-password")
      .populate("planDetails")
      .populate("addresses");
    res
      .status(200)
      .json(
        customizeResponse(
          true,
          "All customers fetched successfully..!",
          merchantsList
        )
      );
  } catch (error) {
    logger.error("Error while fetching all merchnts", error);
    res
      .status(400)
      .json(customizeResponse(false, "Error while fetchig merchants", error));
  }
};
exports.merchantLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!(email && password)) {
      return res
        .status(401)
        .json(customizeResponse(false, "All fields are mandatory..!"));
    }
    let existingUser = await merchantsSchema.findOne({ email });
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
    let payload = { id: existingUser._id, email, role: existingUser.role };
    let token = await jwt.sign(payload, secretkey, { expiresIn: "1m" });
    res.set("token", token);
    let finalResponse = {
      email,
      username: existingUser.username,
    };
    res
      .status(200)
      .json(customizeResponse(true, "Login successfull", finalResponse));
  } catch (error) {
    logger.error("Error while doing merchant login", error);
    res.status(400).json(customizeResponse(false, "Error while login", error));
  }
};
exports.merchantPlanUpdate = async (req, res) => {
  try {
    let { merchantId, planDetails } = req.body;
    let updatePlan = await planDetailsSchema.create(planDetails);
    await merchantsSchema.findByIdAndUpdate(
      merchantId,
      { $push: { planDetails: updatePlan._id } },
      { new: true, useFindAndModify: false }
    );
    res
      .status(201)
      .json(customizeResponse(true, "Updated successfully", updatePlan));
  } catch (error) {
    logger.error("Error while updating a plan", error);
    res
      .status(400)
      .json(customizeResponse(false, "Error while updating a plan", error));
  }
};
exports.merchantProfileUpdate = async (req, res) => {
  try {
    let merchantId = req.params.id;
    req.body.lastModifiedOn = Date.now();
    let updatedProfile = await merchantsSchema.findByIdAndUpdate(
      merchantId,
      req.body,
      { new: true, useFindAndModify: false }
    );
    res
      .status(201)
      .json(customizeResponse(true, "Updated successfully", updatedProfile));
  } catch (error) {
    logger.error("Error while updating a profile", error);
    res
      .status(400)
      .json(customizeResponse(false, "Error while updating a profile", error));
  }
};
exports.addNewMerchantAddress = async (req, res) => {
  try {
    let merchantId = req.params.merchantId;
    let { addresses } = req.body;
    if (!addresses) {
      res.status(400).json(customizeResponse(false, "Address object is empty"));
    }
    let newAddress = await merchantAddress.create(addresses);
    await merchantsSchema.findByIdAndUpdate(
      merchantId,
      { $push: { addresses: newAddress._id } },
      { new: true, useFindAndModify: false }
    );
    res
      .status(201)
      .json(customizeResponse(true, "Updated successfully", newAddress));
  } catch (error) {
    logger.error("Error while adding a new address", error);
    res
      .status(400)
      .json(
        customizeResponse(false, "Error while adding a new address", error)
      );
  }
};
exports.merchantAddressUpdate = async (req, res) => {
  try {
    let merchantAddressId = req.params.addressId;
    let { addresses } = req.body;
    let updatedAddress = await merchantAddress.findByIdAndUpdate(
      merchantAddressId,
      addresses,
      { new: true, useFindAndModify: false }
    );
    res
      .status(201)
      .json(customizeResponse(true, "Updated successfully", updatedAddress));
  } catch (error) {
    logger.error("Error while updating a existing address", error);
    res
      .status(400)
      .json(
        customizeResponse(
          false,
          "Error while updating a existing address",
          error
        )
      );
  }
};
