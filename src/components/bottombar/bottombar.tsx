"use client";

import React from "react";
import "./bottombar.css";
import home from "../../../public/home.png";
import disliked from "../../../public/disliked.png";
import trending from "../../../public/trending.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

const bottombar = ({ page }: { page: "foryou" | "trending" | "disliked" }) => {
  const router = useRouter();
  return (
    <div className="navigation">
      <div
        onClick={() => {
          router.push("/");
        }}
        className="icon"
        style={page === "foryou" ? { backgroundColor: "#7c2ae83a" } : {}}
      >
        <Image src={home} alt="" height={25} />
        <p>For You</p>
      </div>
      <div
        onClick={() => {
          router.push("/upvoted");
        }}
        className="icon"
        style={page === "trending" ? { backgroundColor: "#7c2ae83a" } : {}}
      >
        <Image src={trending} alt="" height={25} />
        <p>Most Upvoted</p>
      </div>
      <div
        onClick={() => {
          router.push("/downvoted");
        }}
        className="icon"
        style={page === "disliked" ? { backgroundColor: "#7c2ae83a" } : {}}
      >
        <Image src={disliked} alt="" height={25} />
        <p>Most Downvoted</p>
      </div>
    </div>
  );
};

export default bottombar;
