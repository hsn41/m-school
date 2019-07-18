const mongoose = require("mongoose");
const studentSchema = mongoose.Schema({
  id: { type: Number },
  name: { type: String, required: true },
  mobile_number: { type: String, required: true },
  email: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  postal_code: { type: String, required: true },
  country: { type: String, required: true }
});
module.exports = mongoose.model("Student", studentSchema);
