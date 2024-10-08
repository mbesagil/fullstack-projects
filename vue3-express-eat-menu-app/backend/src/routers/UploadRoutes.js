const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

const UploadControllers = require("../controllers/UploadControllers.js");

router.route("/uploads/").post(authenticate, UploadControllers.uploadFile);
router.route("/uploads/:file").get(authenticate, UploadControllers.getFile);
router
  .route("/uploads/:file")
  .delete(authenticate, UploadControllers.deleteFile);
router
  .route("/uploads/download/:file")
  .get(authenticate, UploadControllers.downloadFile);
router
  .route("/uploads/getFile/:file")
  .post(authenticate, UploadControllers.getFile);

module.exports = router;
