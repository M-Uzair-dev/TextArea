"use client";

import React, { use, useEffect, useState } from "react";
import "./form.css";
import google from "../../../public/google.png";
import github from "../../../public/github.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { redirectToGitHub, Signup, getGithubInfo } from "@/actions/auth";
import { toast } from "sonner";
import Loader from "@/components/loader/loader";
import { GoogleSignin } from "@/firebase.config";
import { getCookie } from "@/utils/utils";

const SignInForm: React.FC = () => {
  const router = useRouter();
  const answer = getCookie("user");

  useEffect(() => {
    if (answer) {
      window.location.href = "/";
    }
  }, []);

  const [loading, setLoading] = useState<"" | "google" | "github" | "signup">(
    ""
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (loading !== "") return;
      setLoading("signup");
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name")?.toString();
      const email = formData.get("email")?.toString();
      const password = formData.get("password")?.toString();

      if (!name || !email || !password) {
        toast.error("Please fill all the fields");
        setLoading("");
        return;
      }
      const answer = await Signup({ name, email, password });
      if (answer.success) {
        toast.success("Account created successfully, Please login");
        setLoading("");
        router.push("/login");
      } else {
        toast.error(
          answer.message || "Something went wrong, Please try again later."
        );
        setLoading("");
        return;
      }
    } catch (e: any) {
      setLoading("");
      toast.error(e.message || "Something went wrong, Please try again later.");
    }
  };

  let handleProviderLogin = async (provider: "google") => {
    try {
      if (loading !== "") return;
      setLoading(provider);
      let answer = await GoogleSignin();
      if (answer?.success && answer.user) {
        const user: any = await JSON.parse(answer?.user);
        if (typeof user === "object" && user !== null && "_id" in user) {
          document.cookie = `user=${user._id.toString()}; expires=${new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toUTCString()}; path=/; SameSite=None; Secure;`;
          localStorage.setItem("image", user.pfp);
          toast.success("Logged in successfully");
          setLoading("");
          router.push("/");
        } else {
          toast.error("Something went wrong, Please try again later.");
          setLoading("");
        }
      } else {
        toast.error("Something went wrong, Please try again later.");
        setLoading("");
      }
    } catch (e) {
      toast.error("Something went wrong, Please try again later.");
      setLoading("");
      return;
    }
  };
  let handleGithubLogin = async () => {
    if (loading !== "") return;
    setLoading("github");
    redirectToGitHub();
  };
  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1 style={{ color: "black", marginBottom: "20px" }}>Signup</h1>
      <div className="flex-column">
        <label>Name</label>
      </div>
      <div className="inputForm">
        <input
          type="text"
          name="name"
          className="input"
          placeholder="Enter your Name"
          required
        />
      </div>
      <div className="flex-column">
        <label>Email</label>
      </div>
      <div className="inputForm">
        <input
          type="email"
          name="email"
          className="input"
          placeholder="Enter your Email"
          required
        />
      </div>

      <div className="flex-column">
        <label>Password</label>
      </div>
      <div className="inputForm">
        <input
          type="password"
          className="input"
          placeholder="Enter your Password"
          required
          name="password"
        />
        <svg
          viewBox="0 0 576 512"
          height="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="..."></path>
        </svg>
      </div>

      <div className="flex-row">
        <div>
          <input
            type="checkbox"
            id="remember"
            style={{ marginRight: "10px" }}
          />
          <label htmlFor="remember">Remember me</label>
        </div>
        <span className="span">Forgot password?</span>
      </div>

      <button type="submit" className="button-submit">
        {loading === "signup" ? <Loader invert={true} size={0.6} /> : "Sign up"}
      </button>

      <p className="p">
        Already have an account?{" "}
        <span
          className="span"
          onClick={() => {
            router.push("/login");
          }}
        >
          Sign In
        </span>
      </p>
      <p className="p line">Or With</p>

      <div className="flex-row">
        <button
          type="button"
          className="btn google"
          onClick={(e) => {
            e.preventDefault();
            handleProviderLogin("google");
          }}
        >
          <Image
            style={{ filter: "invert(1)" }}
            src={google}
            alt=""
            width={25}
            height={25}
          />
          {loading === "google" ? (
            <Loader invert={true} size={0.6} />
          ) : (
            "Google"
          )}
        </button>
        <button type="button" className="btn apple" onClick={handleGithubLogin}>
          <Image src={github} alt="" width={30} height={30} />
          Github
        </button>
      </div>
    </form>
  );
};

export default SignInForm;
