import express from 'express';

const router = express.Router();

router.get("/usertest", (req,res) => {
    return res.send("In user Test!!!!");
});

router.post("/usertestPost", (req,res) => {
    const username = req.body.username;
    res.send(username);
})

export default router;