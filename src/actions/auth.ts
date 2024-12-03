"use server";

import { connectDB } from "@/Database/functions/auth";
import userModel from "@/Database/models/userModel";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import postModel from "@/Database/models/postModel";
import CommentModel from "@/Database/models/commentModel";

export async function Signup({
  email,
  password,
  name,
}: {
  email: string | undefined;
  password: string | undefined;
  name: string | undefined;
}) {
  try {
    if (!email || !password || !name) {
      return {
        success: false,
        message: "Please fill all the fields",
      };
    }
    if (password.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters",
      };
    }
    await connectDB();
    const user = await userModel.findOne({ email, provider: "credentials" });
    if (user) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    const hashed = await bcrypt.hash(password, 10);
    if (!hashed) {
      return {
        success: false,
        message: "Somethig went wrong. Please try again later.",
      };
    }
    const newUser = await userModel.create({
      email,
      password: hashed,
      name,
      provider: "credentials",
    });
    if (newUser) {
      return {
        success: true,
      };
    }
    return {
      success: false,
      message: "Somethig went wrong. Please try again later.",
    };
  } catch (e: any) {
    return {
      success: false,
      message: e.message || "Somethig went wrong. Please try again later.",
    };
  }
}

export const providerSignin = async ({
  name = "Default User",
  email,
  image = "",
  provider,
  githubIdentifier,
  bio,
}: {
  name: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  provider: "google" | "github";
  githubIdentifier?: string | null | undefined;
  bio?: string | null | undefined;
}) => {
  try {
    if (
      (!email && provider === "google") ||
      (provider === "github" && !githubIdentifier)
    ) {
      return {
        success: false,
        message: "Invalid configuration",
      };
    }
    await connectDB();
    if (provider === "google") {
      const user = await userModel.findOne({ email, provider });
      if (!user) {
        const newUser = await userModel.create({
          email,
          name,
          pfp: image || "",
          provider,
          bio: bio || "no Bio provided.",
        });
        if (newUser) {
          return {
            success: true,
            user: JSON.stringify(newUser),
          };
        } else {
          return {
            success: false,
            message: "Something went wrong, Please try again later.",
          };
        }
      } else {
        return {
          success: true,
          user: JSON.stringify(user),
        };
      }
    } else {
      const user = await userModel.findOne({
        gitHubIdentifier: githubIdentifier,
      });
      if (!user) {
        const newUser = await userModel.create({
          email,
          name,
          pfp: image || "",
          provider,
          bio: bio || "no Bio provided.",
          gitHubIdentifier: githubIdentifier,
        });
        if (newUser) {
          return {
            success: true,
            user: JSON.stringify(newUser),
          };
        } else {
          return {
            success: false,
            message: "Something went wrong, Please try again later.",
          };
        }
      } else {
        return {
          success: true,
          user: JSON.stringify(user),
        };
      }
    }
  } catch (e) {
    console.log("error in Oauth : ", e);
    return {
      success: false,
      message: "Something went wrong, Please try again later.",
    };
  }
};
export const redirectToGitHub = async () => {
  redirect(
    "https://github.com/login/oauth/authorize?client_id=" +
      process.env.GitHub_Client_ID
  );
};

export const getGithubInfo = async (code: string) => {
  try {
    const response = await fetch(
      `https://github.com/login/oauth/access_token?client_id=${process.env.GitHub_Client_ID}&client_secret=${process.env.GitHub_Client_Secret}&code=${code}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();

    if (data.access_token) {
      const userResponse = await fetch(`https://api.github.com/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.access_token}`, // Properly format the Authorization header
        },
      });

      const userData = await userResponse.json();
      const { avatar_url, name, email, bio, login } = userData;
      const result = await providerSignin({
        name,
        email,
        image: avatar_url,
        provider: "github",
        bio,
        githubIdentifier: login,
      });
      return result;
    } else {
      return {
        success: false,
        message: "Failed to retrieve access token. Please try again later.",
      };
    }
  } catch (error) {
    console.error("Error in getGithubInfo:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
};

export const signIn = async ({
  email,
  password,
}: {
  email: string | undefined;
  password: string | undefined;
}) => {
  try {
    if (!email || !password) {
      return {
        success: false,
        message: "Please fill all the fields",
      };
    }
    await connectDB();
    const user = await userModel.findOne({ email, provider: "credentials" });
    if (!user) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return {
          success: false,
          message: "Invalid credentials",
        };
      } else {
        return {
          success: true,
          user: JSON.stringify(user),
        };
      }
    }
  } catch (e) {
    return {
      success: false,
      message: "something went wrong, please try again later.",
    };
  }
};

export const getUser = async (id: string, myId: string | undefined) => {
  try {
    if (!id)
      return {
        success: false,
        message: "no id provided",
      };

    let user = await userModel.findById(id);
    if (user) {
      if (myId) {
        let me = await userModel.findById(myId, {
          following: 1,
        });
        const following = await me.following.map((item: any) =>
          item.toString()
        );
        if (following.includes(user._id.toString())) {
          console.log("matched");
          user = { ...user.toObject(), isFollowing: true };
        }
      }
      console.log(user);
      let stringUser = JSON.stringify(user);
      return {
        success: true,
        user: stringUser,
      };
    }
    return {
      success: false,
      message: "Invalid id",
    };
  } catch (e: any) {
    return {
      success: false,
      message: e.message || "Something went wroong !",
    };
  }
};

export const toggleFollow = async (userId: string, profileId: string) => {
  try {
    if (!userId || !profileId)
      return {
        success: false,
        message: "Invalid params",
      };

    await connectDB();
    let user = await userModel.findById(userId);
    let profile = await userModel.findById(profileId);
    if (!user || !profile)
      return {
        success: false,
        message: "invalid params",
      };

    let ids = user.following.map((item: any) => item.toString());

    if (ids.includes(profileId)) {
      user.following = user.following.filter(
        (item: any) => item.toString() !== profileId
      );
      profile.followers--;
      await user.save();
      await profile.save();
    } else {
      user.following.push(profileId);
      profile.followers++;
      await user.save();
      await profile.save();
    }

    return {
      success: true,
    };
  } catch (e: any) {
    return {
      success: false,
      message: e.message || "something went wrong !",
    };
  }
};
export const getUserPartialData = async (id: string | undefined) => {
  try {
    if (!id) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }
    await connectDB();
    const user = await userModel.findById(id, {
      _id: 1,
      name: 1,
      bio: 1,
    });

    if (!user) {
      return {
        success: false,
        message: "Unauthorized",
      };
    } else {
      let user2 = JSON.stringify(user);
      return {
        success: true,
        user: user2,
      };
    }
  } catch (e: any) {
    return {
      success: false,
      message: e.message || "Something went Wrong !",
    };
  }
};

export const updateUser = async (
  id: string | undefined,
  name: string | undefined,
  bio: string | undefined,
  pfp: string | undefined
) => {
  try {
    if (!id || !name || !bio) {
      return {
        success: false,
        message: "Missing required fields",
      };
    }
    await connectDB();

    const user = await userModel.findById(id);
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    user.name = name;
    user.bio = bio;

    if (pfp) {
      user.pfp = pfp;
    }

    await user.save();

    if (pfp) {
      await CommentModel.updateMany(
        { authorId: id },
        { $set: { authorName: name, authorpfp: pfp } }
      );
    } else {
      await CommentModel.updateMany(
        { authorId: id },
        { $set: { authorName: name } }
      );
    }

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (e: any) {
    return {
      success: false,
      message: e.message || "Something went wrong",
    };
  }
};
export const getFollowed = async (id: string) => {
  try {
    if (!id) {
      return {
        success: false,
        message: "unauthorized",
      };
    }

    await connectDB();

    // Find the user with the given ID
    const user = await userModel.findById(id);

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    if(user.following.length === 0) return {
      success : true,
      noFollowing : true
    }

    // Get the IDs of the users the current user is following
    const followingIds = user.following;

    // Find the followed users based on their IDs
    const followedUsers = await userModel.find(
      { _id: { $in: followingIds } },
      "_id name"
    );

    return {
      success: true,
      data: JSON.stringify(followedUsers),
    };
  } catch (e: any) {
    return {
      success: false,
      message: e.message || "Something went wrong",
    };
  }
};
