import mongoose from "mongoose";

const Post = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    thought: {
      type: String,
      required: true,
    },
    upvotes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    downvotes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    comments: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

let postModel = mongoose.models?.Post || mongoose.model("Post", Post);

export default postModel;
