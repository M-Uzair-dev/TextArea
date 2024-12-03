"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getGithubInfo } from "@/actions/auth";
import { toast } from "sonner";
import Loader from "@/components/loader/loader";

const getGithub = async (secretCode: string) => {
  try {
    let answer = await getGithubInfo(secretCode);
    if (answer.success && answer.user) {
      const user: any = await JSON.parse(answer?.user);
      if (typeof user === "object" && user !== null && "_id" in user) {
        document.cookie = `user=${user._id.toString()}; expires=${new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toUTCString()}; path=/; SameSite=None; Secure;`;
        localStorage.setItem("image", user.pfp);
        window.location.href = "/";
        toast.success("Logged in successfully");
      } else {
        window.location.href = "/signup";
        toast.error("Something went wrong, Please try again later.");
      }
    } else {
      window.location.href = "/signup";
      toast.error("Something went wrong, Please try again later.");
    }
  } catch (error) {
    window.location.href = "/signup";
    toast.error("Something went wrong, Please try again later.");
  }
};

const Page = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");

    if (code) {
      getGithub(code);
    } else {
      window.location.href = "/";
    }
  }, [searchParams]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100dvh - 70px)",
      }}
    >
      <Loader size={1} />
      <h3 style={{ fontWeight: "400" }}>waiting for github...</h3>
    </div>
  );
};

export default Page;
