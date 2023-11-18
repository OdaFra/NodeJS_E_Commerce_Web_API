const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  product:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Products'
  }
});

exports.OrderItems = mongoose.model("OrderItems", orderItemSchema);
