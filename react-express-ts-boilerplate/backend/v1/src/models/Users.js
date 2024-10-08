import Mongoose from "mongoose";
import { passwordToHash } from "../scripts/utils/helper.js";

const userSchema = new Mongoose.Schema(
  {
    full_name: String,
    password: String,
    email: { type: String, unique: true },
  },
  { timestamps: true, versionKey: false }
);

userSchema.statics.createDefaultUser = async function () {
  try {
    const existingUser = await this.findOne({ email: "test@test.com" });
    if (!existingUser) {
      const defaultUser = new this({
        full_name: "Test User",
        password: passwordToHash("123123"),
        email: "test@test.com",
      });
      const savedUser = await defaultUser.save();
      console.log("Varsayılan kullanıcı oluşturuldu:", savedUser);
    } else {
      console.log("Varsayılan kullanıcı zaten mevcut.");
    }
  } catch (error) {
    console.error("Varsayılan kullanıcı oluşturulurken hata oluştu:", error);
  }
};

export default Mongoose.model("user", userSchema);
