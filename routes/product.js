import express from "express";
import Product from "../models/Product.js";

import {
  verifyTokenAndAuthentication,
  verifyTokenAndAdmin,
} from "./verifyToken.js";

const router = express.Router();

//CREATE PRODUCT
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    return res.status(200).json(savedProduct);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//UPDATE PRODUCT

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedProduct);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//DELETE PRODUCT
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const isExist = await Product.findById(req.params.id);
    if (!isExist) return res.status(500).json("Product does not exist!!!");
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json("Product has been deleted successfully!!!!");
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET ALL PRODUCT
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategories = req.query.categories;
  try {
    let product;
    if (qNew) {
      product = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategories) {
      product = await Product.find({
        categories: {
          $in: [qCategories],
        },
      });
    } else {
      product = await Product.find();
    }
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//FIND PRODUCT

router.get("/:id", async (req, res) => {
  try {
    const productInfo = await Product.findById(req.params.id);
    return res.status(200).json(productInfo);
  } catch (err) {
    return res.status(200).json(err);
  }
});

export default router;
