import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
import { generateToken } from '../lib/util.js';
import cloudinary from '../lib/cloudinary.js';


// Fonction pour valider l'email et le mot de passe
const validateSignupData = (email, password) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Vérifie le format de l'email
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/; // Au moins 8 caractères, une majuscule et un chiffre

    if (!emailRegex.test(email)) {
        return "Invalid email format";
    }
    if (!passwordRegex.test(password)) {
        return "Password must be at least 8 characters long and contain at least one uppercase letter and one number";
    }
    return null; // Aucune erreur
};

export const signup = asyncHandler(async (req, res) => {
    const { email, fullName, password } = req.body;

    // Vérifier si toutes les données sont présentes
    if (!email || !fullName || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Vérifier si les données sont valides -> optionel
    const validationError = validateSignupData(email, password);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ error: "Email already exists" });
    }

    // Hasher le mot de passe (10 rounds de sel)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const user = await User.create({
        email,
        fullName,
        password: hashedPassword,
    });

    // Générer le token JWT et le stocker en cookie sécurisé
    generateToken(user, res);

    // Retourner la réponse (sans renvoyer le mot de passe ni le token)
    return res.status(201).json({
        message: "User created successfully",
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilPic: user.profilPic || null, // Gérer le cas où il n'a pas encore d'image de profil
        },
    });
});


export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({ error: "All fields are required" });
    }

    // Vérifier si l'utilisateur existe
    const existUser = await User.findOne({ email });
    if (!existUser) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, existUser.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    // Générer le token et le stocker dans un cookie sécurisé
    generateToken(existUser, res);

    // Retourner l'utilisateur sans renvoyer le token (déjà stocké en cookie)
    return res.status(200).json({
        message: "Login successful",
        user: {
            _id: existUser._id,
            email: existUser.email,
            fullName: existUser.fullName,
            profilPic: existUser.profilPic,
        },
    });
});

export const checkAuth = asyncHandler( (req, res) => {
    const user = req.user;
    res.status(200).json({user}); 
});

export const logout = asyncHandler( async (req, res) => {
    res.clearCookie("accessToken");
    res.status(200).json({ message: "Logged out" });
});


export const updateProfiel = asyncHandler(async (req, res) => {
    try {
        const { profilPic } = req.body;
        const user = req.user;

        // Vérifier que l'image est fournie
        if (!profilPic) {
            return res.status(400).json({ error: "Profile picture is required" });
        }

        // Uploader l'image sur Cloudinary
        const uploadedResponse = await cloudinary.uploader.upload(profilPic, {
            upload_preset: "profil_pics",
        });

        // Vérifier si l'upload a réussi
        if (!uploadedResponse || !uploadedResponse.secure_url) {
            return res.status(500).json({ error: "Failed to upload image" });
        }

        // Mettre à jour l'utilisateur dans la base de données
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { profilPic: uploadedResponse.secure_url },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Répondre avec les nouvelles infos de l'utilisateur
        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                email: updatedUser.email,
                fullName: updatedUser.fullName,
                profilPic: updatedUser.profilPic,
            },
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});




