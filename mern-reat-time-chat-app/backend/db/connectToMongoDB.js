import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("Connected Mongo DB");
  } catch (error) {
    console.log("Mongo error :>> ", error);
  }
};

export default connectToMongoDB;
