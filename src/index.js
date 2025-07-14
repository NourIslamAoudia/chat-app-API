import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './lib/db.js';
import authRouter from './routers/auth.route.js';
import messageRouter from './routers/message.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

// Middleware - Augmenter la limite de taille pour les uploads d'images
app.use(express.json({ limit: '50mb' })); // Augmente la limite à 50MB
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// CORS configuration améliorée
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://127.0.0.1:5501",
    "http://localhost:5501",
    "file://"  // Pour les fichiers HTML ouverts directement
  ],
  credentials: true, // Allow sending cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}));

// Middleware pour gérer les requêtes OPTIONS (preflight)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
    res.header('Access-Control-Expose-Headers', 'Set-Cookie');
    return res.sendStatus(200);
  }
  next();
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

// Default route
app.get("/", (req, res) => {
  res.status(200).json({ "message": "all good" });
});

// Start server
app.listen(port, () => {
  console.log('Server is running on: http://localhost:' + port);
  connectDB();
});