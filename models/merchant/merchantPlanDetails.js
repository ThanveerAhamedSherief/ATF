const mongoose = require("mongoose");
const { Schema } = mongoose;

const planDetailsSchema = new Schema({
  merchantId: {
    type: String,
  },
  subscribedPlanType: {
    type: String,
  },
  subscribedPlanStart: {
    type: Date,
  },
  subscribedPlanEnd: {
    type: Date,
  },
  subscribedPlanPrice: {
    type: String,
  },
  isActive: {
    type: Boolean, default: false
  },
});

exports.planDetailsSchema = mongoose.model("planDetails", planDetailsSchema);
