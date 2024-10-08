const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UsersControllers");

router.route("/list").post(UserController.list);
router.route("/create").post(UserController.create);
router.route("/login").post(UserController.login);
router.route("/get/:id").get(UserController.getOne);
router.route("/update/:id").put(UserController.update);
router.route("/delete/:id").delete(UserController.deleteItem);

module.exports = router;
