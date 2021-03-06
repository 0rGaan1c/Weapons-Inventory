const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WeaponSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

WeaponSchema.virtual("url").get(function () {
  return "/weapon" + this._id;
});

module.exports = mongoose.model("Weapon", WeaponSchema);
