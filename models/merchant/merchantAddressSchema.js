const mongoose = require("mongoose");
const { Schema } = mongoose;
const merchantAddressSchema = new Schema({
  street: { type: String },
  postalCode: { type: Number },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  lat: { type: String },
  lang: { type: String },
  addresstype: { type: String },
});

exports.merchantAddress = mongoose.model(
  "merchantAddress",
  merchantAddressSchema
);
