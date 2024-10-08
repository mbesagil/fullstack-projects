import express from "express";
import validate from "../middlewares/validate.js";
import { authenticateToken } from "../middlewares/authenticate.js";
import schemas from "../validations/Users.js";
import {
  index,
  getAll,
  update,
  create,
  deleteStory,
} from "../controllers/Stories.js";

const router = express.Router();

router.get("/", authenticateToken, index);

router.route("/").post(authenticateToken, create);
router.post("/getAll", authenticateToken, getAll);

router.route("/:id").put(authenticateToken, update);

router.route("/:id").delete(authenticateToken, deleteStory);

export default router;
