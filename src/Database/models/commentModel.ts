import mongoose from "mongoose";

const Comment = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorpfp: {
      type: String,
      default: "",
    },
    authorfollowers: {
      type: Number,
      default: 0,
    },
    reports: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

let CommentModel =
  mongoose.models?.Comment || mongoose.model("Comment", Comment);

export default CommentModel;
