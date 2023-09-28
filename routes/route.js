const express = require("express");
const { customizeResponse } = require("../utils/customResponse");
const router = express.Router();

router.get("/", (req, res) => {
  let finalResponse = customizeResponse(
    true,
    "Welcome to ATF",
    "Basic get route is working fine"
  );
  return res.status(200).json(finalResponse);
});

module.exports = router;
