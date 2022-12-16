import express from "express";
import { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthentication } from "./verifyToken.js";
import Cart from "../models/Cart.js";

const router = express.Router();

//ADD ITEM TO CARD

router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const saveCart = await newCart.save();
    return res.status(200).json(saveCart);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//UPDATE CART
router.put("/:id", verifyTokenAndAuthentication, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    return res.status(200).json(updatedCart);
  } catch (err) {
    return res.status(500).json(err);
  }
});


//DELETE ITEM FROM CART

router.delete("/:id", verifyTokenAndAuthentication, async (req,res) => {
    try{
        await Cart.findByIdAndDelete(req.params.id);
        return res.status(200).json("Item has been removed fromn the cart")
    }catch(err){
        return res.status(500).json(err);
    }
})

// GET ALL CART ITEMS

router.get("/", verifyTokenAndAdmin, async (req,res) => {
    try{
        const cartItems = await Cart.find();
        return res.status(200).json(cartItems);
    }catch(err){
        return res.status(500).json(err);
    }
})

// GET SPECIFIC CART ITEM

router.get("/find/:userId", verifyToken, async (req,res) => {
    try{
        const cartItem = Cart.findOne({userId : req.params.id});
        return res.status(200).json(cartItem);
    }catch(err){
        return res.status(500).json(err);
    }
})

export default router;
