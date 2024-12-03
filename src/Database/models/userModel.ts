import mongoose from "mongoose";

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    bio: {
      type: String,
      default: "No bio provided",
    },
    followers: {
      type: Number,
      default: 0,
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    pfp: {
      type: String,
      default: "",
    },
    provider: {
      type: String,
      default: "",
    },
    gitHubIdentifier: {
      type: String,
    },
    comments: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "Comment",
    },
    posts: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "Post",
    },
  },
  { timestamps: true }
);
let userModel = mongoose.models?.User || mongoose.model("User", User);
export default userModel;
