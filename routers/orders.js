const { Order } = require("../models/order");
const { OrderItems } = require("../models/order-item");

const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const orderList = await Order.find();

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

// Add
router.post("/", async (req, res) => {
  try {
    const orderItemsIds = await Promise.all(
      (req.body.orderItems).map(async (orderItem) => {
        let newOrderItem = new OrderItems({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });
        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
      })
    );

    console.log(`El valor es orderItems es ${req.body.orderItems}`)

    //  const orderItemsIdsResolved = await orderItemsIds

    let order = new Order({
      orderItems: orderItemsIds,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: req.body.totalPrice,
      user: req.body.user,
    });

    order = await order.save();

    if (!order) {
      return res.status(400).send("The order cannot be created!");
    }

    res.send(order);

    
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
