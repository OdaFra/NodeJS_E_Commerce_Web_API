const { Order } = require("../models/order");
const { OrderItems } = require("../models/order-item");

const express = require("express");
const router = express.Router();

//Get All
router.get(`/`, async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

//Get by id
router.get(`/:id`, async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });

  if (!order) {
    res.status(500).json({ success: false });
  }
  res.send(order);
});

// Add
router.post("/", async (req, res) => {
  try {
    const orderItemsIds = await Promise.all(
      req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItems({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });
        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
      })
    );

    console.log(`El valor es orderItems es ${req.body.orderItems}`);

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

// Update Order
router.put("/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );
  if (!order) return res.status(400).send("The order cannot be updated!");

  res.send(order);
});

// Delete orders
router.delete("/:id", (req, res) => {
  Order.findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItem.map(async orderItem=>{
          await orderItem.findByIdAndRemove(orderItem)
        })

        return res.status(200).json({
          success: true,
          message: "The order is delete",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Order not found!!!",
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        success: false,
        error: err,
      });
    });
});

module.exports = router;
