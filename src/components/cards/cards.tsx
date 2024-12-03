"use client";
import React, { useEffect, useState } from "react";
import "./cards.css";
import Card from "./card";
import {
  GetAllPosts,
  GetDownvotedPosts,
  GetUpvotedPosts,
  GetUsersPosts,
  SearchAllPosts,
} from "@/actions/post";
import { getCookie } from "@/utils/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import Loader from "@/components/loader/loader";

const cards = ({
  page,
  term,
}: {
  page: "foryou" | "search" | "upvoted" | "downvoted" | "profile";
  term?: string;
}) => {
  let [loading, setLoading] = useState(true);
  let userID: string | undefined = "";
  const [posts, setPosts]: any = useState([]);

  const Router = useRouter();

  let fetchData = async () => {
    try {
      if (page === "foryou") {
        const answer: any = await GetAllPosts(userID);
        if (answer.success) {
          setPosts(JSON.parse(answer?.posts));
        } else {
          toast.error("No posts found.");
        }
      }
      if (page === "search") {
        if (term) {
          const answer: any = await SearchAllPosts(userID, term);
          if (answer.success) {
            setPosts(JSON.parse(answer?.posts));
          } else {
            toast.error("No posts found.");
          }
        } else {
          toast.error("Please type the search param. ");
        }
      }
      if (page === "upvoted") {
        const answer: any = await GetUpvotedPosts(userID);
        if (answer.success) {
          setPosts(JSON.parse(answer?.posts));
        } else {
          toast.error("No posts found.");
        }
      }
      if (page === "downvoted") {
        const answer: any = await GetDownvotedPosts(userID);
        if (answer.success) {
          setPosts(JSON.parse(answer?.posts));
        } else {
          toast.error("No posts found.");
        }
      }
      if (page === "profile") {
        if (term) {
          const answer: any = await GetUsersPosts(userID, term);
          if (answer.success) {
            setPosts(JSON.parse(answer?.posts));
            console.log(JSON.parse(answer?.posts));
          } else {
            toast.error("User has no posts.");
          }
        }
      }
    } catch (e) {
      toast.error("Could not fetch posts");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Check if running on the client
    if (typeof window !== "undefined") {
      setTimeout(() => {
        document.querySelector(".sidebar")?.classList.add("transition");
      }, 500);

      const userID = getCookie("user");
      console.log("User ID:", userID);

      fetchData();
    }
  }, []);

  return (
    <div
      className="cards"
      style={page == "profile" ? { overflowY: "visible" } : undefined}
    >
      {loading ? (
        <div className="loader">
          <Loader />
        </div>
      ) : posts?.length > 0 ? (
        posts?.map((item: any) => (
          <div
            key={item._id}
            onClick={() => {
              Router.push(`/post/${item._id}`);
            }}
          >
            <Card item={item} profile={page == "profile"} />
          </div>
        ))
      ) : (
        <p className="loader">No Posts here.</p>
      )}
    </div>
  );
};

export default cards;
