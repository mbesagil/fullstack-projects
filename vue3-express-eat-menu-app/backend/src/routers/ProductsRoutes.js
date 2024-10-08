const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/security");

const ProductsControllers = require("../controllers/ProductsControllers");

router.route("/list").post(authenticate, ProductsControllers.list);
router.route("/listByCategory").post(authenticate, ProductsControllers.listByCategory);
router.route("/create").post(authenticate, ProductsControllers.create);
router.route("/get/:id").get(authenticate, ProductsControllers.getOne);
router.route("/update/:id").put(authenticate, ProductsControllers.update);
router
  .route("/delete/:id")
  .delete(authenticate, ProductsControllers.deleteItem);

module.exports = router;
