import { connectDB } from "./db.js";

const loaders = () => {
  connectDB();
};
export default loaders;
