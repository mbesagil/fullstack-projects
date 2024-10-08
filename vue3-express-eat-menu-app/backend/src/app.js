const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const loaders = require("./loaders/index.js");
const dotenv = require("dotenv");
const upload = require("express-fileupload");
const path = require("path");

const {
  UploadRoutes,
  UsersRoutes,
  CompaniesRoutes,
  CategoryiesRoutes,
  ProductsRoutes,
} = require("./routers/index.js");

dotenv.config();
loaders();

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

//uploads
app.use(upload());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

console.log("basladi");

app.listen(process.env.APP_PORT, () => {
  console.log(
    `sunucu http://localhost:${process.env.APP_PORT} uzerinde ayağa kalktı`
  );
  // app.use("/userss", UsersRoutes);

  //uploads
  app.use("/", UploadRoutes);

  app.use("/users", UsersRoutes);
  app.use("/companies", CompaniesRoutes);
  app.use("/categories", CategoryiesRoutes);
  app.use("/products", ProductsRoutes);
});

