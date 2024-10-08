import Mongoose from "mongoose";

const storySchema = new Mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    isPublished: { type: Boolean, default: false }
  },
  { timestamps: true, versionKey: false }
);

export default Mongoose.model("story", storySchema);