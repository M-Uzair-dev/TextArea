"use client";

import React, { use, useEffect, useState } from "react";
import Input from "@/components/input/input";
import Textarea from "@/components/input/textarea";
import Button from "@/components/button/primary";
import "./post.css";
import { toast } from "sonner";
import { getPostPartialData, updatePost } from "@/actions/post";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader/loader";
import { getCookie } from "@/utils/utils";

type Post = {
  title: string | undefined;
  thought: string | undefined;
};
const page = ({ params }: { params: any }) => {
  const { id } = use<{ id: string }>(params);
  const userID = getCookie("user");
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const router = useRouter();
  const [data, setData] = useState<Post>({
    title: "",
    thought: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      if (!userID) {
        router.push("/");
        toast.error("Unauthorized");
        return;
      }
      const answer = await getPostPartialData(id, userID);
      if (answer.success && answer.post) {
        const { title, thought } = await JSON.parse(answer.post);

        setData({
          title,
          thought,
        });
      } else {
        toast.error(answer.message || "Something went wrong !");
        router.push("/");
      }
    } catch (e: any) {
      toast.error(e.message || "Something went wrong");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, [id]);

  let handleChange = (e: any) => {
    e.preventDefault();
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const editPost = async () => {
    try {
      if (!id || !data.title || !data.thought) {
        toast.error("Please fill all the fields");
        return;
      }
      if (updating) return;
      setUpdating(true);

      if (!userID) {
        router.push("/");
        toast.error("Unauthorized");
        return;
      }

      const answer = await updatePost(id, data.title, data.thought, userID);

      if (answer.success) {
        toast.error("Post edited successfully");
        router.push("/post/" + id);
      } else {
        toast.error(answer.message || "Something went wrong");
      }
    } catch (e: any) {
      toast.error(e.message || "Something went wrong");
    } finally {
      setUpdating(false);
    }
  };
  return (
    <div className="post editpost">
      {loading ? (
        <div className="loaderdivinpost">
          <Loader />
        </div>
      ) : data ? (
        <>
          <h1>Edit your post : </h1>
          <form>
            <label htmlFor="title">Title : </label>
            <br />
            <Input
              type="text"
              value={data.title}
              onChange={handleChange}
              name="title"
            >
              Title
            </Input>
            <br />
            <label htmlFor="thought">Thought : </label>
            <br />
            <Textarea
              value={data.thought}
              onChange={handleChange}
              name="thought"
            >
              Enter your thought
            </Textarea>

            <br />
            <Button
              onClick={editPost}
              style={
                updating
                  ? {
                      height: "40px",
                      width: "109px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }
                  : {}
              }
            >
              {updating ? <Loader size={0.5} white /> : "Update"}
            </Button>
          </form>
        </>
      ) : (
        <h1>Oops, Something went wrong !</h1>
      )}
    </div>
  );
};

export default page;
