import Image from "next/image";
import React from "react";
import Button from "@/components/button/primary";

const comment = ({ comment }: { comment: any }) => {
  return (
    <div className="comment">
      <div className="userinfo">
        <div className="leftuserinfo">
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
          <Button>Report</Button>
        </div>
      </div>
      <h3 className="text" style={{ whiteSpace: "pre-wrap" }}>
        {comment.text}
      </h3>
    </div>
  );
};

export default comment;
