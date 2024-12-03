"use client";

import React, { useState } from "react";
import { useDebounce } from "@/utils/clientutils";
import "./navbar.css";
import logo from "../../../public/logo.png";
import Image from "next/image";
import Button from "../button/primary";
import { useRouter } from "next/navigation";
import { getCookie } from "@/utils/utils";

const navbar = () => {
  const router = useRouter();
  const answer = getCookie("user");
  let pfp;
  if (typeof window !== "undefined") {
    pfp = localStorage.getItem("image");
  }
  const [inputVaue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputVaue, 500);
  React.useEffect(() => {
    if (debouncedInputValue) {
      router.push(`/search/${debouncedInputValue}`);
    }
  }, [debouncedInputValue, router]);

  return (
    <div className="navbar">
      <Image
        onClick={() => {
          router.push("/");
        }}
        src={logo}
        alt="logo"
        width={50}
        height={50}
        style={{ cursor: "pointer" }}
      />
      <div className="right">
        <div className="input-wrapper">
          <button className="icon">
            <svg
              width="25px"
              height="25px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M22 22L20 20"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
          <input
            type="text"
            name="text"
            className="inputinnav"
            placeholder="search.."
            value={inputVaue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (e.target.value === "") {
                router.push("/");
              }
            }}
          />
        </div>
        {answer ? (
          <>
            <div className="create" onClick={() => router.push("/new")}>
              +
            </div>
            <Image
              className="pfp"
              onClick={() => router.push(`/profile/${answer}`)}
              alt="pfp"
              height={40}
              width={40}
              src={
                pfp
                  ? pfp
                  : "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
              }
              style={{ aspectRatio: "1/1", filter: "none", objectFit: "cover" }}
            ></Image>
          </>
        ) : (
          <div onClick={() => router.push("/login")}>
            <Button>Sign in</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default navbar;
