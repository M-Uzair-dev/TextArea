"use client";

import Image from "next/image";
import React, { useState } from "react";
import Button from "@/components/button/primary";
import { getCookie } from "@/utils/utils";
import { useRouter } from "next/navigation";
import { DeleteComment } from "@/actions/comments";
import { toast } from "sonner";
const comment = ({ comment, postID }: { comment: any; postID: string }) => {
  const userID = getCookie("user");
  const router = useRouter();
  const isAuthor = userID === comment?.authorId;
  const [deleted, setDeleted] = useState(false);

  const RemoveComment = async () => {
    if (!comment?._id || !userID) return;
    setDeleted(true);
    const answer = await DeleteComment(comment?._id, userID, postID);
    if (!answer.success) {
      toast.error(answer.message || "Comment Deletion Failed !");
      setDeleted(false);
    }
  };

  return (
    <div
      className="comment"
      style={
        deleted
          ? {
              display: "none",
            }
          : {}
      }
    >
      <div className="userinfo">
        <div
          className="leftuserinfo"
          onClick={() => {
            router.push("/profile/" + comment?.authorId);
          }}
        >
          <Image
            src={
              comment?.authorpfp ||
              "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
            }
            alt="pfp"
            width={35}
            height={35}
          />
          <div className="usernamediv">
            <p>{comment?.authorName || "User"}</p>
            <p>
              {comment?.authorfollowers || "0"}{" "}
              {comment?.authorfollowers == 1 ? " Follower" : " Followers"}
            </p>
          </div>
        </div>
        <div className="rightuserinfo">
          {isAuthor ? <Button onClick={RemoveComment}>Delete</Button> : <></>}
        </div>
      </div>
      <h3 className="text" style={{ whiteSpace: "pre-wrap" }}>
        {comment.text}
      </h3>
    </div>
  );
};

export default comment;
