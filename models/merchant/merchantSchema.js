const mongoose = require("mongoose");
const { Schema } = mongoose;

const merchantsSchema = new Schema(
  {
    firstname: { type: String, required: [true, "Firstname is required"], unique: true },
    lastname: { type: String, required: [true, "Lastname is required"] },
    email: { type: String, required: [true, "Email is required"], unique: true },
    username: { type: String, required: true, unique: true },
    storename: { type: String, required: true, unique: true },
    profilePicture: {
      data: Buffer,
      contentType: String
    },
    mobileNumber: { type: Number, required: true },
    alternativeMobileNumber: { type: Number },
    website: { type: String },
    instagramLink: { type: String },
    facebookLink: { type: String },
    twitterLink: { type: String },
    addresses: [{ type: mongoose.Types.ObjectId, ref: "merchantAddress" }],
    customerStatus: { type: String },
    password: { type: String, required: true },
    isMultipleLocatedStore: { type: Boolean },
    planDetails: [{ type: mongoose.Types.ObjectId, ref: "planDetails" }],
    role: { type: String, required: true, default: "merchant" },
    isActive: { type: Boolean },
    gstNo: { type: String },
    token: {
      type: String,
    },
    createdOn: { type: Date },
    lastModifiedOn: { type: Date },
  },
  { timestamps: true }
);

const virtual = merchantsSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
merchantsSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.merchantsSchema = mongoose.model("merchants", merchantsSchema);
