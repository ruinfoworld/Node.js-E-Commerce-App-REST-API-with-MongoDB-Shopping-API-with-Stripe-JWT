import jwt from "jsonwebtoken";

export const verifyToken = (req,res,next) => {
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_KEY, (err, user) => {
            if(err) return res.status(403).json("Token is invalid!!!")
            req.user = user;
            next();
        })
    }else{
        return res.status(403).json("You are not authenticated!!!");
    }
}

export const verifyTokenAndAuthentication = (req,res,next) => {
    verifyToken(req,res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }else{
            res.status(500).json("You are not allowed to perform this operation!!!");
        }
    })
}

export const verifyTokenAndAdmin = (req,res,next) => {
    verifyToken(req,res, () => {
        if(req.user.isAdmin){
            next();
        }else{
            res.status(500).json("You are not allowed to perform this operation!!!");
        }
    });
}