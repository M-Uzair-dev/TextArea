"use client";

import React, { useEffect, useState } from "react";
import "./cards.css";
import Image from "next/image";
import Button from "../button/primary";
import upvote from "../../../public/upvote.png";
import upvoted from "../../../public/upvoted.png";
import comment from "../../../public/comment.png";
import { formatDate2, getCookie } from "@/utils/utils";
import { toast } from "sonner";
import { DownVote, UpVote } from "@/actions/post";
import { useRouter } from "next/navigation";
import { toggleFollow } from "@/actions/auth";
const card = ({
  item,
  profile,
}: {
  item: {
    _id: string;
    title: string;
    createdAt: string;
    comments: string[];
    upvotes: string[];
    downvotes: string[];
    postedBy: {
      _id: string;
      pfp: string;
      name: string;
      followers: number;
    };
    action: string;
    following: boolean;
  };
  profile?: boolean;
}) => {
  const router = useRouter();
  const [action, setAction] = useState(item.action);
  const [upvotes, setUpvotes] = useState(item.upvotes.length);
  const [downvotes, setDownvotes] = useState(item.downvotes.length);
  const [following, setFollowing] = useState(item.following);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [userID, setUserID] = useState(getCookie("user"));

  const handleUpVote = () => {
    if (userID) {
      if (item._id) {
        UpVote(userID, item._id)
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
        if (action === "upvoted") {
          setUpvotes(upvotes - 1);
          setAction("none");
        } else if (action === "downvoted") {
          setDownvotes(downvotes - 1);
          setUpvotes(upvotes + 1);
          setAction("upvoted");
        } else {
          setUpvotes(upvotes + 1);
          setAction("upvoted");
        }
      } else {
        toast.error("Something is wrong !");
      }
    } else {
      toast.error("please login !");
    }
  };
  const handleDownVote = () => {
    if (userID) {
      DownVote(userID, item._id)
        .then((res) => {
          console.log(res);
          if (!res.success) {
            toast.error(res.message || "something went wrong");
            router.push("/");
          }
        })
        .catch((e: any) => {
          console.log(e);
          toast.error(e.message || "something went wrong");
          router.push("/");
        });
      if (item._id) {
        if (action === "downvoted") {
          setDownvotes(downvotes - 1);
          setAction("none");
        } else if (action === "upvoted") {
          setUpvotes(upvotes - 1);
          setDownvotes(downvotes + 1);
          setAction("downvoted");
        } else {
          setDownvotes(downvotes + 1);
          setAction("downvoted");
        }
      } else {
        toast.error("Something is wrong !");
      }
    } else {
      toast.error("please login !");
    }
  };

  const follow = async (e: any) => {
    try {
      e.stopPropagation();
      if (!userID) {
        toast.error("please login to follow !");
        return;
      }
      if (loadingFollow) return;
      setFollowing((prev) => !prev);
      setLoadingFollow(true);
      let answer = await toggleFollow(userID, item.postedBy._id);
      if (!answer.success) {
        toast.error(answer.message);
        setLoadingFollow(false);
        setFollowing((prev) => !prev);
        return;
      }
    } catch (e: any) {
      setLoadingFollow(false);
      toast.error(e.message || "Something went wrong !");
      setFollowing((prev) => !prev);
    }
  };
  return (
    <div className="card">
      <div className="userinfo">
        <div
          className="leftuserinfo"
          onClick={(e) => {
            e.stopPropagation();
            router.push("/profile/" + item.postedBy._id);
          }}
          style={{ cursor: "pointer" }}
        >
          <Image
            src={
              item?.postedBy.pfp ||
              "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
            }
            alt="pfp"
            width={40}
            height={40}
          />
          <div className="usernamediv">
            <p>{item.postedBy.name}</p>
            <p>
              {item.postedBy.followers} follower
              {item.postedBy.followers > 1 ||
                (item.postedBy.followers == 0 && "s")}
            </p>
          </div>
        </div>
        <div className="rightuserinfo">
          {profile ? (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                router.push("/edit/" + item._id);
              }}
            >
              Edit
            </Button>
          ) : (
            <Button onClick={follow}>
              {following ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>
      </div>
      <h1 className="title">{item.title}</h1>
      <div className="postinfo">
        <div className="votes">
          <div
            className="upvote"
            onClick={(e) => {
              e.stopPropagation();
              handleUpVote();
            }}
          >
            {action === "upvoted" ? (
              <Image src={upvoted} alt="" width={20} height={20} />
            ) : (
              <Image src={upvote} alt="" width={20} height={20} />
            )}
            <p>{upvotes || "0"}</p>
          </div>
          <div
            className="downvote"
            onClick={(e) => {
              e.stopPropagation();
              handleDownVote();
            }}
          >
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

            <p>{downvotes || "0"}</p>
          </div>

          <div className="downvote">
            <Image src={comment} alt="" width={20} height={20} />

            <p>{item?.comments?.length || "0"}</p>
          </div>
        </div>
        <p className="date">{formatDate2(item.createdAt)}</p>
      </div>
    </div>
  );
};

export default card;
