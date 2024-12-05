"use client";

import React, { useEffect, useState } from "react";
import Comment from "./comment";
import { Populate } from "@/actions/comments";
import Loader from "../loader/loader";

const comments = ({
  commentsIds,
  added,
  postID,
}: {
  commentsIds: string[];
  added: any[];
  postID: string;
}) => {
  const [loading, setLoading] = useState(true);
  const [noComm, setNoComm] = useState(false);
  const [comments, setComments] = useState([]);

  const getData = async () => {
    try {
      const answer = await Populate(commentsIds);
      if (answer.success && typeof answer.comments === "string") {
        let Comments = JSON.parse(answer?.comments);

        if (Comments.length > 0) {
          setComments(Comments);
          console.log(Comments);
        } else {
          setNoComm(true);
        }
      } else {
        setNoComm(true);
      }
    } catch (e) {
      setNoComm(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (commentsIds?.length > 0) {
      getData();
    } else {
      setNoComm(true);
      setLoading(false);
    }
  }, []);
  return (
    <div className="comments" style={{ marginBottom: "20px" }}>
      <h3>Comments : </h3>

      {loading ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader />
        </div>
      ) : added && noComm ? (
        added?.map((comment: any) => (
          <Comment key={comment._id} comment={comment} postID={postID} />
        ))
      ) : noComm ? (
        <p style={{ textAlign: "center" }}>No comments</p>
      ) : added ? (
        added
          .concat(comments)
          ?.map((comment: any) => (
            <Comment key={comment._id} comment={comment} postID={postID} />
          ))
      ) : (
        comments?.map((comment: any) => (
          <Comment key={comment._id} comment={comment} postID={postID} />
        ))
      )}
    </div>
  );
};

export default comments;
