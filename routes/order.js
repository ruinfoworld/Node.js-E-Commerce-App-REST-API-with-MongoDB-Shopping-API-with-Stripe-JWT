import express from "express";
import Order from "../models/Order.js";
import {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthentication,
} from "./verifyToken.js";

const router = express.Router();

//CREATE AN ORDER

router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const saveOrder = await newOrder.save();
    return res.status(200).json(saveOrder);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// UPDATE AN ORDER

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    return res.status(200).json(updatedOrder);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted!!!");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET USERS ORDER

router.get("/find/:userId", verifyTokenAndAuthentication, async (req, res) => {
  try {
    const orderItems = await Order.find({ userId: req.params.id });
    return res.status(200).json(orderItems);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET ALL ORDERS

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    return res.status(200).json(orders);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Statistics - GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const states = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
        },
      },
      {
        $project: {
          month: {
            $month: "$createdAt",
          },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: {
            $sum: "$sales",
          },
        },
      },
    ]);
    res.status(200).json(states);
  } catch (err) {
    return res.status(500).json(err);
  }
});

export default router;
