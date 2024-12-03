"use client";

import React, { useEffect, useState } from "react";
import Input from "@/components/input/input";
import Textarea from "@/components/input/textarea";
import Button from "@/components/button/primary";
import "./post.css";
import { getCookie } from "@/utils/utils";
import { useRouter } from "next/navigation";
import { addPost } from "@/actions/post";
import { toast } from "sonner";
import Loader from "@/components/loader/loader";

const page = () => {
  const router = useRouter();
  const answer = getCookie("user");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!answer) {
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    if (!answer) {
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title")?.toString();
    const thought = formData.get("thought")?.toString();
    const postedBy = answer;

    if (!title || !thought) {
      toast.error("Title and thought are required");
      setLoading(false);
      return;
    }

    try {
      const result = await addPost({ title, thought, postedBy });

      if (result.success) {
        const data = JSON.parse(result?.data || "{}");
        toast.success("Post created successfully");
        router.push("/post/" + data?._id?.toString());
      } else {
        toast.error(
          result.message || "Something went wrong, Please try again later."
        );
      }
    } catch (error) {
      console.error("Error while calling addPost:", error);
      toast.error("Failed to submit post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newPost">
      <h1>Create a new post : </h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title : </label>
        <br />
        <Input type="text" name="title">
          Title
        </Input>
        <br />
        <label htmlFor="thought">Thought : </label>
        <br />
        <Textarea name="thought">Enter your thought</Textarea>

        <br />
        <Button
          type="submit"
          style={loading ? { backgroundColor: "#5209b3 !important" } : {}}
        >
          {loading ? "Loading..." : "Post"}
        </Button>
      </form>
    </div>
  );
};

export default page;
