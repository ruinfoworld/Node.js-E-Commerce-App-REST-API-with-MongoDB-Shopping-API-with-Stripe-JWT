import express from "express";
import User from "../models/User.js";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
const router = express.Router();

// Register

router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.HASH_KEY
    ).toString(),
  });

  try {
    const data = await User.findOne({ email: req.body.email });
    if (data) {
      return res.status(500).json("User already exist with same email!!!!");
    }
    const saveData = await newUser.save();
    return res
      .status(200)
      .json({ message: "User created", data: saveData, status: 201 });
  } catch (error) {
    return res.status(500).json(error);
  }
});

// Login

router.post("/login", async (req, res) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (!userExist)
      return res
        .status(500)
        .json({ status: 401, message: "Invalid login credentials!!!" });

    const hashPassword = CryptoJS.AES.decrypt(
      userExist.password,
      process.env.HASH_KEY
    );

    const decryptedPassword = hashPassword.toString(CryptoJS.enc.Utf8);

    if (decryptedPassword !== req.body.password)
      return res
        .status(500)
        .json({ status: 401, message: "Invalid login credentials!!!" });
    const {password, ...others} = userExist._doc;
    const accessToken = jwt.sign({
        id : userExist._id,
        isAdmin : userExist.isAdmin
    },process.env.JWT_KEY,{expiresIn : "3d"});

    return res.status(200).json({status : 200, data : {...others, accessToken}});

  } catch (err) {
    return res.status(500).json(err);
  }
});

export default router;
