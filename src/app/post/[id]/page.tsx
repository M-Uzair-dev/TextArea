"use client";

import React, { useEffect, useState, use } from "react";
import "./post.css";
import "@/components/cards/cards.css";
import Button from "@/components/button/primary";
import Image from "next/image";
import upvote from "../../../../public/upvote.png";
import upvoted from "../../../../public/upvoted.png";
import comment from "../../../../public/comment.png";
import { useRouter } from "next/navigation";
import Comment from "@/components/comment/comment";
import Input from "@/components/input/textarea";
import { DownVote, getPost, UpVote } from "@/actions/post";
import { toast } from "sonner";
import { formatDate, getCookie } from "@/utils/utils";
import { addComment } from "@/actions/comments";
import Comments from "@/components/comment/comments";
import Loader from "@/components/loader/loader";
import { toggleFollow } from "@/actions/auth";

type Post = {
  _id: string;
  comments: any[];
  createdAt: string;
  downvotes: string[];
  postedBy: string;
  thought: string;
  title: string;
  updatedAt: string;
  upvotes: string[];
};

type User = {
  _id: string;
  name: string;
  followers: number;
  pfp: string;
};

const page = ({ params }: any) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const userID = getCookie("user");
  const [user, setUser] = useState<User>({
    _id: "",
    name: "",
    followers: 0,
    pfp: "",
  });
  const [post, setPost] = useState<Post>({
    _id: "",
    comments: [],
    createdAt: "",
    downvotes: [],
    postedBy: "",
    thought: "",
    title: "",
    updatedAt: "",
    upvotes: [],
  });
  const [commentLoading, setCommentLoading] = useState(false);
  const [input, setInput] = useState("");
  const [added, setAdded] = useState<any[]>([]);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [following, setFollowing] = useState(false);

  const [action, setAction] = useState("none");
  const { id }: any = use(params);

  const getData = async (PostId: string) => {
    try {
      let answer = await getPost(PostId, userID);
      if (answer.success) {
        setUser(JSON.parse(answer.user));
        setPost(JSON.parse(answer.post));
        setAction(answer.action);
        setFollowing(answer.following);
      } else {
        toast.error(
          answer.message || "Something went wrong, Please try again later."
        );
        router.push("/");
      }
    } catch (e: any) {
      toast.error(e.message || "Something went wrong, Please try again later.");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async () => {
    if (commentLoading) return;

    if (!userID) {
      toast.error("please login to comment.");
    }
    if (!input) {
      toast.error("Please type the comment");
      return;
    }
    if (!id) {
      router.push("/");
    }
    setCommentLoading(true);
    try {
      const answer = await addComment({
        commentedBy: userID,
        text: input,
        postId: id,
      });

      if (answer.success && answer.data) {
        toast.success("Comment added successfully");
        let data = await JSON.parse(answer.data);
        setAdded((prev: any) => [data, ...prev]);
        setInput("");
      } else {
        toast.error("Something went wrong !");
      }
    } catch (e: any) {
      toast.error(e.message || "Something went wrong");
    } finally {
      setCommentLoading(false);
    }
  };
  useEffect(() => {
    if (!id) {
      router.push("/");
      return;
    }
    setLoading(true);
    getData(id);
  }, []);

  const handleUpvote = () => {
    if (userID) {
      if (id) {
        UpVote(userID, id)
          .then((res) => {
            if (!res.success) {
              toast.error(res.message || "something went wrong");
              router.push("/");
            }
          })
          .catch((e: any) => {
            toast.error(e.message || "something went wrong");
            router.push("/");
          });
      }

      if (action === "upvoted") {
        setAction("none");
        setPost((prev) => ({
          ...prev,
          upvotes: prev.upvotes?.filter((id) => id !== userID) || [],
        }));
      } else if (action === "downvoted") {
        setAction("upvoted");
        setPost((prev) => ({
          ...prev,
          upvotes: [...(prev.upvotes || []), userID],
          downvotes: prev.downvotes?.filter((id) => id !== userID) || [],
        }));
      } else {
        setAction("upvoted");
        setPost((prev) => ({
          ...prev,
          upvotes: [...(prev.upvotes || []), userID],
        }));
      }
    } else {
      toast.error("please login to interact with a post");
    }
  };

  const handleDownvote = () => {
    if (userID) {
      if (id) {
        DownVote(userID, id)
          .then((res) => {
            if (!res.success) {
              toast.error(res.message || "something went wrong");
              router.push("/");
            }
          })
          .catch((e: any) => {
            toast.error(e.message || "something went wrong");
            router.push("/");
          });
      }

      if (action === "downvoted") {
        setAction("none");
        setPost((prev) => ({
          ...prev,
          downvotes: prev.downvotes?.filter((id) => id !== userID) || [],
        }));
      } else if (action === "upvoted") {
        setAction("downvoted");
        setPost((prev) => ({
          ...prev,
          downvotes: [...(prev.downvotes || []), userID],
          upvotes: prev.upvotes?.filter((id) => id !== userID) || [],
        }));
      } else {
        setAction("downvoted");
        setPost((prev) => ({
          ...prev,
          downvotes: [...(prev.downvotes || []), userID],
        }));
      }
    } else {
      toast.error("please login to interact with a post");
    }
  };

  const toggleFollowState = () => {
    if (following) {
      setUser((prev) => ({
        ...prev,
        followers: prev.followers - 1,
      }));

      setFollowing(false);
    } else {
      setUser((prev) => ({
        ...prev,
        followers: prev.followers + 1,
      }));
      setFollowing(true);
    }
  };
  const follow = async (e: any) => {
    try {
      let myId = userID;
      e.stopPropagation();
      if (!myId) {
        toast.error("please login to follow !");
        return;
      }
      if (loadingFollow) {
        toast.error("loading, please wait...");
        return;
      }

      setLoadingFollow(true);
      toggleFollowState();
      let answer = await toggleFollow(myId, post.postedBy);
      if (!answer.success) {
        toast.error(answer.message || "Something went wrong !");
        toggleFollowState();
        return;
      }
    } catch (e: any) {
      toast.error(e.message || "Something went wrong !");
      toggleFollowState();
    } finally {
      setLoadingFollow(false);
    }
  };

  return (
    <div className="post">
      {loading ? (
        <div className="loaderdiv">
          <Loader />
        </div>
      ) : (
        <>
          <div className="userinfo top topinpost">
            <div className="leftuserinfo">
              <Image
                src={
                  "https://www.pngfind.com/pngs/m/139-1391483_png-file-svg-back-button-icon-png-transparent.png"
                }
                alt="pfp"
                width={35}
                height={35}
                style={{
                  filter: "invert(1)",
                  opacity: "0.8",
                  cursor: "pointer",
                }}
                onClick={() => router.back()}
              />
              <div
                className="clickable"
                onClick={() => {
                  router.push("/profile/" + user?._id);
                }}
                style={{ cursor: "pointer" }}
              >
                <Image
                  src={
                    user?.pfp ||
                    "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
                  }
                  alt="pfp"
                  width={50}
                  height={50}
                />
                <div className="usernamediv inpost">
                  <p>{user?.name || "User"}</p>
                  <p>
                    {user?.followers || "0"}{" "}
                    {user?.followers === 1 ? "follower" : "followers"}
                  </p>
                </div>
              </div>
            </div>
            <div className="rightuserinfo">
              {user._id === userID ? (
                <Button
                  onClick={() => {
                    router.push("/edit/" + id);
                  }}
                >
                  Edit
                </Button>
              ) : following ? (
                <Button onClick={follow}>Unfollow</Button>
              ) : (
                <Button onClick={follow}>Follow</Button>
              )}
            </div>
          </div>
          <h1>{post?.title || "Oops !"}</h1>
          <p style={{ whiteSpace: "pre-wrap" }}>
            {post?.thought || "Something went wrong !"}
          </p>
          <div className="postinfo">
            <div className="votes">
              <div className="upvote" onClick={handleUpvote}>
                {action === "upvoted" ? (
                  <Image src={upvoted} alt="" width={20} height={20} />
                ) : (
                  <Image src={upvote} alt="" width={20} height={20} />
                )}
                <p>{post?.upvotes?.length || "0"}</p>
              </div>
              <div className="downvote" onClick={handleDownvote}>
                {action === "downvoted" ? (
                  <Image
                    src={upvoted}
                    style={{ transform: "rotate(180deg)" }}
                    alt=""
                    width={20}
                    height={20}
                  />
                ) : (
                  <Image
                    src={upvote}
                    style={{ transform: "rotate(180deg)" }}
                    alt=""
                    width={20}
                    height={20}
                  />
                )}

                <p>{post?.downvotes?.length || "0"}</p>
              </div>

              <div className="downvote">
                <Image src={comment} alt="" width={20} height={20} />

                <p>{post?.comments?.length || "0"}</p>
              </div>
            </div>
            <p className="date">{formatDate(post?.createdAt)}</p>
          </div>
          <div className="addComment">
            <Input
              style={{
                marginRight: "20px",
                maxWidth: "100%",
                maxHeight: "30vh",
              }}
              value={input}
              onChange={(e) => {
                if (id && userID) {
                  setInput(e.target.value);
                } else {
                  toast.error("please login first.");
                }
              }}
            >
              Comment
            </Input>
            <Button
              onClick={handleComment}
              style={
                commentLoading
                  ? {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "40px",
                      width: "88px",
                    }
                  : {}
              }
            >
              {commentLoading ? <Loader size={0.5} white /> : "Post"}
            </Button>
          </div>
          <Comments added={added} commentsIds={post.comments} postID={id} />
        </>
      )}
    </div>
  );
};

export default page;
