"use server";

import { connectDB } from "@/Database/functions/auth";
import CommentModel from "@/Database/models/commentModel";
import postModel from "@/Database/models/postModel";
import userModel from "@/Database/models/userModel";

export async function addComment({
  text,
  commentedBy,
  postId,
}: {
  text: string | undefined;
  commentedBy: string | undefined;
  postId: string | undefined;
}) {
  try {
    if (!text || !commentedBy || !postId) {
      return {
        success: false,
        message: "incomplete details",
      };
    }

    await connectDB();

    let post = await postModel.findById(postId);

    if (!post) {
      return {
        success: false,
        message: "invalid params",
      };
    }

    const user = await userModel.findById(commentedBy);
    if (!user) {
      return {
        success: false,
        message: "invalid params",
      };
    }

    const comment = await CommentModel.create({
      text,
      authorName: user.name,
      authorId: user._id,
      authorpfp: user.pfp,
      authorfollowers: user.followers,
    });

    if (!comment) {
      return {
        success: false,
        message: "invalid params",
      };
    }

    post.comments = [...post.comments, comment._id];

    await post.save();
    user.comments = [...user.comments, comment._id];

    await user.save();
    return {
      success: true,
      message: "comment added successfully",
      data: JSON.stringify(comment),
    };
  } catch (e: any) {
    console.error(e);
    return {
      success: false,
      message: e.message || "invalid params",
    };
  }
}

export async function Populate(commentIds: string[]) {
  try {
    if (commentIds.length < 1) {
      return {
        success: true,
        comments: [],
      };
    }
    await connectDB();
    console.log(commentIds);
    let comments = await CommentModel.find({
      _id: { $in: commentIds },
    });
    let newcomments: string = JSON.stringify(comments);
    return {
      success: true,
      comments: newcomments,
    };
  } catch (e: any) {
    console.log(e);
    return {
      success: false,
      message: e.message || "Something went wrong !",
    };
  }
}

export async function DeleteComment(
  commentID: string,
  userID: string,
  postId: string
) {
  try {
    if (!commentID || !userID || !postId)
      return {
        success: false,
        message: "Unauthorized",
      };
    const comment = await CommentModel.findById(commentID);
    if (comment) {
      if (comment.authorId.toString() !== userID)
        return {
          success: false,
          message: "Unauthorized",
        };

      const post = await postModel.findById(postId);
      if (!post) {
        return {
          success: false,
          message: "Unauthorized",
        };
      }

      post.comments = post.comments.filter(
        (id: string) => id.toString() !== commentID.toString()
      );

      await post.save();
      await comment.deleteOne();
      return {
        success: true,
        message: "Comment deleted successfully",
      };
    }

    return {
      success: false,
      message: "Comment not found",
    };
  } catch (e: any) {
    return {
      success: false,
      message: e.message || "Something went wrong !",
    };
  }
}
