import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import {connectDB} from './lib/db.js';
import authRouter from './routers/auth.route.js';
import messageRouter from './routers/message.route.js';
const app = express();
const port=process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);


app.listen(port, () => {
  console.log('Server is running on: http://localhost:' + port);
  connectDB();
});