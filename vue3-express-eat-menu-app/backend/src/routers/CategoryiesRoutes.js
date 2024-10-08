const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/security");

const CategoriesControllers = require("../controllers/CategoriesControllers");

router.route("/list").post(authenticate, CategoriesControllers.list);
router.route("/listByCompany").post(authenticate, CategoriesControllers.listByCompany);
router.route("/create").post(authenticate, CategoriesControllers.create);
router.route("/get/:id").get(authenticate, CategoriesControllers.getOne);
router.route("/update/:id").put(authenticate, CategoriesControllers.update);
router
  .route("/delete/:id")
  .delete(authenticate, CategoriesControllers.deleteItem);

module.exports = router;
