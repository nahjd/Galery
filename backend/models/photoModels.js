const { Schema, model } = require("mongoose");

const photoSchema = new Schema(
  {
    title: { type: String, trim: true },
    url:   { type: String, required: true, trim: true },
    tags:  { type: [String], default: [] },
  },
  { collection: "photos", timestamps: true }
);

module.exports = model("Photo", photoSchema);
