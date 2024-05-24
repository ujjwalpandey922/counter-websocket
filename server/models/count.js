const mongoose = require("mongoose");

const CountSchema = new mongoose.Schema({
  LiveCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Count", CountSchema);
