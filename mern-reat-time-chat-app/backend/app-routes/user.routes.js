import express from "express";
import { getUsers } from "../controllers/user.controller.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express();

router.get("/", protectRoute, getUsers);

export default router;
