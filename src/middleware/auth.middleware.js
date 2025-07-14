import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


export const protectRoute = async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ error: "Not authorized - No Token Provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({ error: "Not authorized - Token is Invalid" });
        }

        const user = await User.findById(decoded.userId).select("-password");
        req.user = user;
        next();

    } catch (error) {
        console.error("error in the middleware protectRoute ", error);
        return res.status(500).json({ error: error.message });
    }
}