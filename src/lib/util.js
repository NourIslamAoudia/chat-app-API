import jwt from "jsonwebtoken";

export const generateToken = (user, res) => {
    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.cookie("accessToken", token, {
        httpOnly: true, // Protection contre XSS
        secure: process.env.NODE_ENV === "production", // Active HTTPS en production
        sameSite: "Strict", // Protection contre CSRF
        maxAge: 24 * 60 * 60 * 1000, // Expiration après 1 jour
        path: "/", // ✅ Le cookie est accessible partout
    });
};
