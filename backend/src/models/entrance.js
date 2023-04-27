const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  typeOrder: {
    type: String,
    default: "Venda",
    trim: true
  },

  value: {
    type: Number,
    required: true,
    trim: true
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Entrance', schema);
