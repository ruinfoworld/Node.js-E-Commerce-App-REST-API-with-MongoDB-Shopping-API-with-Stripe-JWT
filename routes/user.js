import express from 'express';
import User from '../models/User.js';
import { verifyTokenAndAuthentication } from './verifyToken.js';

const router = express.Router();

router.put("/:id", verifyTokenAndAuthentication, async (req,res) => {
    if(req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.HASH_KEY
          ).toString()
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set : req.body
        }, {new : true})
        return res.status(200).json(updatedUser);
    }catch(err){
        return res.status(500).json(err)
    }
});

export default router;