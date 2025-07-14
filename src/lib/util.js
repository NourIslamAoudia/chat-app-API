import jwt from "jsonwebtoken";
import cloudinary from "./cloudinary.js";

// Génère un token JWT pour l'utilisateur et le stocke dans un cookie
//jwt.sign est utilisé pour créer le token
export const generateToken = (user, res) => {
    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
    // on a utiliser le cookie psq il est plus sécurisé que le localStorage
    res.cookie("accessToken", token, {
        httpOnly: false, 
        secure: false, // ⚠ Mets `true` en production (HTTPS)
        maxAge: 24 * 60 * 60 * 1000, // 1 jour
        path: "/",
        sameSite: "Lax", // Permet le partage du cookie entre domaines différents
    });
};
