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
    const orderItemIdsResolved = await Promise.all(
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

    //  const orderItemIdsResolvedResolved = await orderItemIdsResolved

    if (orderItemIdsResolved.length === 0) {
      return res.status(400).send("No order items provided!");
    }

    const totalPrices = await Promise.all(
      orderItemIdsResolved.map(async (orderItemId) => {
        try {
          const orderItem = await OrderItems.findById(orderItemId).populate(
            "product",
            "price"
          );

          if (!orderItem) {
            throw new Error("Order item not found!");
          }
          const totalPrice = orderItem.product.price * orderItem.quantity;
          return totalPrice;
        } catch (error) {
          console.error("Error calculating totalPrice:", error.message);
          throw error;
        }
      })
    );

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

    console.log(totalPrices);

    let order = new Order({
      orderItems: orderItemIdsResolved,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: totalPrice,
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
        await Promise.all(
          order.orderItems.map(async (orderItem) => {
            await OrderItems.findByIdAndRemove(orderItem._id);
          })
        );

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

//GET TotalSales
router.get("/get/totalsales", async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
  ]);
  if (!totalSales) {
    return res.status(400).send("The order sales cannot be generated");
  }
  res.send({
    totalSales: totalSales.pop().totalSales,
  });
});

//Get count
router.get(`/get/count`, async (req, res) => {
  const orderCount = await Order.countDocuments({});
  if (!orderCount) {
    res.status(500).json({
      success: false,
    });
  }
  res.send({ orderCount: orderCount });
});

//Get users orders
router.get(`/get/usersorders/:userid`, async (req, res) => {
  const userOrderList = await Order.find({ user: req.params.userid })
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    })
    .sort({ dateOrdered: -1 });

  if (!userOrderList) {
    res.status(500).json({ success: false });
  }
  res.send(userOrderList);
});

module.exports = router;
