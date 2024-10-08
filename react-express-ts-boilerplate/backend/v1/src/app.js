import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import loaders from "./loaders/index.js";
import { UserRoutes, AuthRoutes, StoryRoutes } from "./api-routes/index.js";

// Yükleyiciler ve yapılandırmalar
dotenv.config();
loaders();

// Uygulama oluşturma
const app = express();

// Orta katmanlar
app.use(cors());
app.use(express.json());
app.use(helmet());

// Rotalar
app.use('/api/users', UserRoutes); //users
app.use('/api/auth', AuthRoutes); //auths
app.use('/api/stories', StoryRoutes); //story

// Sunucuyu başlatma
const PORT = process.env.APP_PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server ${PORT} up`);
});
