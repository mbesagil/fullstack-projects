import express from "express";
import dotnev from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { app, server } from "./socket/socket.js";

import authRoutes from "./app-routes/auth.routes.js";
import messageRoutes from "./app-routes/message.routes.js";
import userRoutes from "./app-routes/user.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";

dotnev.config();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

server.listen(PORT, () => {
  console.log(`Server running port ${PORT}`);
  connectToMongoDB();
});
