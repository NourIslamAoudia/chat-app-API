import jwt from "jsonwebtoken";


// Génère un token JWT pour l'utilisateur et le stocke dans un cookie
//jwt.sign est utilisé pour créer le token
export  const generateToken = (user, res) => {
    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
    // on a utiliser le cookie psq il est plus sécurisé que le localStorage
    res.cookie("accessToken", token, {
         httpOnly: true,            // Protège contre XSS
        secure: false,             // ✅ true en HTTPS (production)
        sameSite: "Lax",           // Compatible inter-domaines (dans ton cas local)
        maxAge: 24 * 60 * 60 * 1000, // 1 jour
    });
};
