const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const uniquevalidator = require("mongoose-unique-validator");
const userSchema = mongoose.Schema({
  id: { type: Number },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: Number, required: true }
});

userSchema.plugin(uniquevalidator);

module.exports = mongoose.model("User", userSchema);
