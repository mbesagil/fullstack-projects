import express from "express";
import validate from "../middlewares/validate.js";
import { authenticateToken } from "../middlewares/authenticate.js";
import schemas from "../validations/Users.js";
import {
  index,
  update,
  changePassword,
  deleteUser,
} from "../controllers/Users.js";

const router = express.Router();

router.get("/me", authenticateToken, index);
router
  .route("/")
  .patch(authenticateToken, validate(schemas.updateValidation), update);

router
  .route("/change-password")
  .post(
    authenticateToken,
    validate(schemas.changePasswordValidation),
    changePassword
  );
router.route("/:id").delete(authenticateToken, deleteUser);

export default router;
