const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/security");

const CompaniesControllers = require("../controllers/CompaniesControllers");

router.route("/list").post(authenticate, CompaniesControllers.list);
router.route("/create").post(authenticate, CompaniesControllers.create);
router.route("/get/:id").get(authenticate, CompaniesControllers.getOne);
router.route("/update/:id").put(authenticate, CompaniesControllers.update);
router
  .route("/delete/:id")
  .delete(authenticate, CompaniesControllers.deleteItem);

module.exports = router;
