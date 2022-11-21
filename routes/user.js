import express from 'express';

const router = express.Router();

router.get("/usertest", (req,res) => {
    console.log("User Test!!!!")
});

export default router;