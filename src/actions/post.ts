"use server";

import { connectDB } from "@/Database/functions/auth";
import postModel from "@/Database/models/postModel";
import userModel from "@/Database/models/userModel";

export async function addPost({
  title,
  thought,
  postedBy,
}: {
  title: string | undefined;
  thought: string | undefined;
  postedBy: string | undefined;
}) {
  try {
    await connectDB();
    let post = await postModel.create({ title, thought, postedBy });
    if (post) {
      let user = await userModel.findById(post?.postedBy);
      !user.posts || user?.posts?.length < 1
        ? (user.posts = [post._id])
        : (user.posts = [...user?.posts, post._id]);
      await user.save();
      post = JSON.stringify(post);
      return {
        success: true,
        message: "Post created successfully",
        data: post,
      };
    } else {
      return {
        success: false,
        message: "Post creation failed",
      };
    }
  } catch (e: any) {
    return {
      success: false,
      message: e.message || "Post creation failed",
    };
  }
}

export async function getPost(
  id: string,
  userid: string | undefined
): Promise<any> {
  try {
    if (!id) {
      return {
        success: false,
        message: "Id is undefined",
      };
    }

    await connectDB();
    let post: any = await postModel.findById(id);
    if (post) {
      let user: any = await userModel.findById(post?.postedBy, {
        _id: 1,
        name: 1,
        followers: 1,
        pfp: 1,
      });
      if (user) {
        let action;
        if (!userid) {
          action = "none";
        } else if (post?.upvotes?.includes(userid)) {
          action = "upvoted";
        } else if (post?.downvotes?.includes(userid)) {
          action = "downvoted";
        } else {
          action = "none";
        }

        let following = false;
        if (userid) {
          const me = await userModel.findById(userid);
          if (me && me.following.length > 0) {
            let followingList = me?.following?.map((item: any) =>
              item.toString()
            );
            following = followingList.includes(post?.postedBy?.toString());
          }
        }

        user = JSON.stringify(user);
        post = JSON.stringify(post);

        return {
          success: true,
          post: post,
          user: user,
          action,
          following,
        };
      } else {
        return {
          success: false,
          message: "User not found.",
        };
      }
    } else {
      return {
        success: false,
        message: "Post not found",
      };
    }
  } catch (e: any) {
    return {
      success: false,
      message: e.message || "something went wrong",
    };
  }
}

export async function UpVote(userid: string, postId: string) {
  try {
    if (!userid || !postId) {
      return {
        success: false,
        message: "Invalid parameters",
      };
    }

    await connectDB();
    let post = await postModel.findById(postId);
    if (!post) {
      return {
        success: false,
        message: "Post not found",
      };
    }

    if (post.upvotes.includes(userid)) {
      post.upvotes = post.upvotes.filter(
        (id: string) => id.toString() !== userid
      );
      await post.save();
      return {
        success: true,
        message: "Post un-upvoted successfully",
      };
    }

    if (post.downvotes.includes(userid)) {
      post.downvotes = post.downvotes.filter(
        (id: string) => id.toString() !== userid
      );
      await post.save();
    }

    post.upvotes.push(userid);
    await post.save();
    return {
      success: true,
      message: "Post upvoted successfully",
    };
  } catch (e: any) {
    return {
      success: false,
      message: e.message || "Something went wrong",
    };
  }
}
export async function DownVote(userid: string, postId: string) {
  try {
    if (!userid || !postId) {
      return {
        success: false,
        message: "Invalid parameters",
      };
    }

    await connectDB();

    let post = await postModel.findById(postId);
    if (!post) {
      return {
        success: false,
        message: "Post not found",
      };
    }

    if (post.downvotes.includes(userid)) {
      post.downvotes = post.downvotes.filter(
        (id: string) => id.toString() !== userid
      );
      await post.save();
      return {
        success: true,
        message: "Post un-downvoted successfully",
      };
    }

    if (post.upvotes.includes(userid)) {
      post.upvotes = post.upvotes.filter(
        (id: string) => id.toString() !== userid
      );
      await post.save();
    }

    post.downvotes.push(userid);
    await post.save();
    return {
      success: true,
      message: "Post downvoted successfully",
    };
  } catch (e: any) {
    return {
      success: false,
      message: e.message || "Something went wrong",
    };
  }
}

export async function GetAllPosts(userId: string | undefined) {
  try {
    await connectDB();

    // Fetch posts and populate `postedBy` with only specified fields
    let posts = await postModel.find({}).sort({ createdAt: -1 }).populate({
      path: "postedBy", // Path to the reference
      select: "name pfp followers _id", // Specify only the fields to retrieve
    });

    // Add action property based on upvotes and downvotes
    if (userId) {
      const user = await userModel.findById(userId).select("following");
      const following = user.following.map((item: string) => item.toString());
      posts = posts.map((item) => {
        const action = item?.upvotes?.includes(userId)
          ? "upvoted"
          : item?.downvotes?.includes(userId)
          ? "downvoted"
          : "none";

        const theAnswer = following.includes(item.postedBy._id.toString());
        return { ...item.toObject(), action, following: theAnswer }; // Convert document to plain object
      });
    }
    return {
      success: true,
      posts: JSON.stringify(posts),
    };
  } catch (e: any) {
    return {
      success: false,
      message: e.message || "Something went wrong.",
    };
  }
}

export async function GetUpvotedPosts(userId: string | undefined) {
  try {
    await connectDB();

    // Fetch posts, calculate `upvoteCount`, sort by it, and populate `postedBy`
    let posts = await postModel.aggregate([
      {
        $addFields: {
          upvoteCount: { $size: "$upvotes" }, // Calculate the length of `upvotes`
        },
      },
      {
        $sort: { upvoteCount: -1 }, // Sort by `upvoteCount` in descending order
      },
      {
        $lookup: {
          from: "users", // The collection to join (usually the model name in lowercase + "s")
          localField: "postedBy", // Field in `postModel` referencing the `users` collection
          foreignField: "_id", // Field in the `users` collection
          as: "postedBy", // Output array name
        },
      },
      {
        $unwind: "$postedBy", // Unwind the populated array to make it a single object
      },
      {
        $project: {
          // Include only the desired fields
          title: 1,
          content: 1,
          upvotes: 1,
          downvotes: 1,
          upvoteCount: 1,
          "postedBy.name": 1,
          "postedBy.pfp": 1,
          "postedBy.followers": 1,
          "postedBy._id": 1,
        },
      },
    ]);

    // Add action property based on upvotes and downvotes
    if (userId) {
      const user = await userModel.findById(userId).select("following");
      const following = user.following.map((item: string) => item.toString());
      posts = posts.map((item) => {
        const action = item?.upvotes?.includes(userId)
          ? "upvoted"
          : item?.downvotes?.includes(userId)
          ? "downvoted"
          : "none";

        const theAnswer = following.includes(item.postedBy._id.toString());
        return { ...item, action, following: theAnswer }; // Convert document to plain object
      });
    }
    console.log("posts", posts);
    return {
      success: true,
      posts: JSON.stringify(posts), // Convert the result to JSON
    };
  } catch (e: any) {
    console.log(e);
    return {
      success: false,
      message: e.message || "Something went wrong.",
    };
  }
}
export async function GetDownvotedPosts(userId: string | undefined) {
  try {
    await connectDB();

    // Fetch posts, calculate `downvoteCount`, sort by it, and populate `postedBy`
    let posts = await postModel.aggregate([
      {
        $addFields: {
          downvoteCount: { $size: "$downvotes" }, // Calculate the length of `downvotes`
        },
      },
      {
        $sort: { downvoteCount: -1 }, // Sort by `downvoteCount` in descending order
      },
      {
        $lookup: {
          from: "users", // The collection to join (usually the model name in lowercase + "s")
          localField: "postedBy", // Field in `postModel` referencing the `users` collection
          foreignField: "_id", // Field in the `users` collection
          as: "postedBy", // Output array name
        },
      },
      {
        $unwind: "$postedBy", // Unwind the populated array to make it a single object
      },
      {
        $project: {
          // Include only the desired fields
          title: 1,
          content: 1,
          upvotes: 1,
          downvotes: 1,
          downvoteCount: 1,
          "postedBy.name": 1,
          "postedBy.pfp": 1,
          "postedBy.followers": 1,
          "postedBy._id": 1,
        },
      },
    ]);

    // Add action property based on upvotes and downvotes
    if (userId) {
      const user = await userModel.findById(userId).select("following");
      const following = user.following.map((item: string) => item.toString());
      posts = posts.map((item) => {
        const action = item?.upvotes?.includes(userId)
          ? "upvoted"
          : item?.downvotes?.includes(userId)
          ? "downvoted"
          : "none";

        const theAnswer = following.includes(item.postedBy._id.toString());
        console.log(item);
        return { ...item, action, following: theAnswer };
      });
    }
    return {
      success: true,
      posts: JSON.stringify(posts), // Convert the result to JSON
    };
  } catch (e: any) {
    return {
      success: false,
      message: e.message || "Something went wrong.",
    };
  }
}
export async function SearchAllPosts(
  userId: string | undefined,
  param: string | undefined = ""
) {
  try {
    await connectDB();

    // Fetch posts and populate `postedBy` with only specified fields
    let posts = await postModel
      .find({
        title: { $regex: param, $options: "i" },
      })
      .sort({ createdAt: -1 })
      .populate({
        path: "postedBy", // Path to the reference
        select: "name pfp followers _id", // Specify only the fields to retrieve
      });

    // Add action property based on upvotes and downvotes
    if (userId) {
      const user = await userModel.findById(userId).select("following");
      const following = user.following.map((item: string) => item.toString());
      posts = posts.map((item) => {
        const action = item?.upvotes?.includes(userId)
          ? "upvoted"
          : item?.downvotes?.includes(userId)
          ? "downvoted"
          : "none";

        const theAnswer = following.includes(item.postedBy._id.toString());
        return { ...item.toObject(), action, following: theAnswer }; // Convert document to plain object
      });
    }

    return {
      success: true,
      posts: JSON.stringify(posts),
    };
  } catch (e: any) {
    return {
      success: false,
      message: e.message || "Something went wrong.",
    };
  }
}

export async function GetUsersPosts(
  userId: string | undefined,
  profileId: string | undefined = ""
) {
  try {
    if (!profileId)
      return {
        success: false,
        message: "profile id is required",
      };
    await connectDB();

    let posts = await postModel
      .find({
        postedBy: profileId,
      })
      .sort({ createdAt: -1 })
      .populate({
        path: "postedBy",
        select: "name pfp followers _id",
      });
    if (userId) {
      const user = await userModel.findById(userId).select("following");
      const following = user.following.map((item: string) => item.toString());

      posts = posts.map((item) => {
        const action = item?.upvotes?.includes(userId)
          ? "upvoted"
          : item?.downvotes?.includes(userId)
          ? "downvoted"
          : "none";
        let answerOfFollowing = following.includes(
          item.postedBy._id.toString()
        );
        return { ...item.toObject(), action, following: answerOfFollowing }; // Convert document to plain object
      });
    }

    return {
      success: true,
      posts: JSON.stringify(posts),
    };
  } catch (e: any) {
    return {
      success: false,
      message: e.message || "Something went wrong.",
    };
  }
}
export const getPostPartialData = async (id: string) => {
  try {
    if (!id) {
      return {
        success: false,
        message: "Invalid id parameter",
      };
    }

    await connectDB();

    const post = await postModel.findById(id, {
      title: 1,
      thought: 1,
    });

    if (!post) {
      return {
        success: false,
        message: "Invalid id parameter 2",
      };
    } else {
      return {
        success: true,
        post: JSON.stringify(post),
      };
    }
  } catch (e: any) {
    return {
      success: false,
      message: e.message || "something went wrong !",
    };
  }
};

export const updatePost = async (
  id: string,
  title: string,
  thought: string
) => {
  try {
    if (!id || !title || !thought) {
      return {
        success: false,
        message: "All parameters (id, title, thought) are required",
      };
    }

    await connectDB();

    const updatedPost = await postModel.findByIdAndUpdate(
      id,
      { title, thought },
      { new: true, fields: { _id: 1 } } // Return only the updated post's ID
    );

    if (!updatedPost) {
      return {
        success: false,
        message: "Post not found or failed to update",
      };
    }

    return {
      success: true,
      id: updatedPost._id.toString(),
    };
  } catch (e: any) {
    return {
      success: false,
      message: e.message || "Something went wrong!",
    };
  }
};
