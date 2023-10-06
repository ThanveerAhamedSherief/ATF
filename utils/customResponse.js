module.exports.customizeResponse = (status, description, response) => {
  return status
    ? {
        Status: "SUCCESS",
        Description: description,
        Details: response,
      }
    : {
        Status: "FAIL",
        Description: description,
        ...(response && { info: "Please check the error.log"}),
        Details: response,
      };
};
