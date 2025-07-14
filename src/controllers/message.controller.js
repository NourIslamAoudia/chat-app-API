import Message from '../models/message.model.js';
import User from '../models/user.model.js';
import asyncHandler from 'express-async-handler';
import cloudinary from '../lib/cloudinary.js';

export const getUsersForChat = asyncHandler(async (req, res) => {
    const currentUser = req.user;
    const users = await User.find({ _id: { $ne: currentUser._id } }).select("-password");
    return res.status(200).json(users);
});


export const getMessages = asyncHandler(async (req, res) => {
    const userToChatId = req.params.id;
    const myId = req.user._id;

    const messages = await Message.find({
        $or: [
            { senderId: userToChatId, receiverId: myId },
            { senderId: myId, receiverId: userToChatId },
        ],
    }).sort({ createdAt: 1 });

    return res.status(200).json(messages);

});


export const sendMessage = asyncHandler(async (req, res) => {
    const userToChatId = req.params.id;
    const myId = req.user._id;
    const { text, image } = req.body;

    // Vérifier si le destinataire existe
    const recipientExists = await User.findById(userToChatId);
    if (!recipientExists) {
        return res.status(404).json({ error: "User not found" });
    }

    // Vérifier qu'il y a au moins du texte ou une image
    if (!text && !image) {
        return res.status(400).json({ error: "Message cannot be empty" });
    }

    let imageUrl;
    if (image) { // Si l'utilisateur envoie une image
        try {
            // Upload de l'image sur Cloudinary
            const uploadedResponse = await cloudinary.uploader.upload(image, {
                upload_preset: "message_images",
            });

            if (!uploadedResponse?.secure_url) {
                return res.status(500).json({ error: "Failed to upload image" });
            }

            imageUrl = uploadedResponse.secure_url;
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ error: "Image upload failed" });
        }
    }

    // Enregistrer le message en base de données
    const message = new Message({
        senderId: myId,
        receiverId: userToChatId,
        text,
        image: imageUrl,
    });

    await message.save();

    // TODO: Envoyer une notification à userToChatId via Socket.io

    return res.status(201).json(message);
});
