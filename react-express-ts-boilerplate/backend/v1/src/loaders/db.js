import Mongoose from "mongoose";
import Users  from "../models/Users.js";

const db = Mongoose.connection;

db.once("open", async () => {
  console.log("DB bağlantısı yapıldı.. ");
  await Users.createDefaultUser();
});

const connectDB = async () => {
  await Mongoose.connect(
    `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
};

export { connectDB };
