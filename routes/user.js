import express from "express";
import User from "../models/User.js";
import {
  verifyTokenAndAuthentication,
  verifyTokenAndAdmin,
} from "./verifyToken.js";

const router = express.Router();

//UPDATE USER
router.put("/:id", verifyTokenAndAuthentication, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.HASH_KEY
    ).toString();
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//DELETE USER
router.delete("/:id", verifyTokenAndAuthentication, async (req, res) => {
  try {
    const isExist = await User.findById(req.params.id);
    if (!isExist) return res.status(500).json("User does not exist!!!");
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json("User has been deleted successfully!!!!");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET SPECIFIC USER

router.get("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const userInfo = await User.findById(req.params.id);
    const { password, ...other } = userInfo._doc;
    return res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET ALL USER

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const userData = req.query.newuser
      ? await User.find().sort({ _id: -1 }).limit(1)
      : await User.find();
    return res.status(200).json(userData);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router;

export default router;
