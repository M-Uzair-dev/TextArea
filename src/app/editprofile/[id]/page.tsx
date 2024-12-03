"use client";

import React, { useEffect, useState, use } from "react";
import Input from "@/components/input/input";
import Textarea from "@/components/input/textarea";
import Button from "@/components/button/primary";
import "./post.css";
import { toast } from "sonner";
import Image from "next/image";
import { getCookie } from "@/utils/utils";
import { getUserPartialData, updateUser } from "@/actions/auth";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader/loader";

const page = ({ params }: { params: any }) => {
  const uid = getCookie("user");
  const { id } = use<any>(params);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const [data, setData] = useState({
    name: "",
    bio: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files && e.target.files[0].type.startsWith("image/")) {
      setFile(e?.target?.files[0]);
    } else {
      toast.error("Please select a image.");
      setFile(null);
      const fileInput = document.getElementById("file");
      if (fileInput && fileInput instanceof HTMLInputElement) {
        fileInput.value = ""; // Clear the input
      }
    }
  };

  const uploadFile = async () => {
    if (!file) return false;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "thoughtsArea");
    data.append("cloud_name", "dexeo4ce2");

    setUploading(true);
    try {
      let answer = await fetch(
        "https://api.cloudinary.com/v1_1/dexeo4ce2/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      let value = await answer.json();
      return value.url;
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (file) {
        let url = await uploadFile();
        setLoading(true);
        if (url) {
          const answer = await updateUser(id, data.name, data.bio, url);
          if (answer.success) {
            toast.success("profile updated successfully !");
            localStorage.setItem("image", url);
            router.push("/");
            router.refresh();
            return;
          } else {
            toast.error("Something went wrong !");
            return;
          }
        } else {
          toast.error("Image upload failed. ");
          return;
        }
      } else {
        setLoading(true);
        const answer = await updateUser(id, data.name, data.bio, undefined);
        if (answer.success) {
          toast.success("profile updated successfully !");
        } else {
          toast.error("Something went wrong !");
          return;
        }
      }
    } catch (e: any) {
      toast.error(e.message || "Something went wrong !");
      return;
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      if (uid == id) {
        const answer = await getUserPartialData(id);
        if (answer.success && answer.user) {
          setData(JSON.parse(answer.user));
        } else {
          toast.error(answer.message || "Something went wrong !");
        }
      } else {
        router.push("/");
      }
    } catch (e: any) {
      toast.error(e.message || "Something went wrong !");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  let handleInputChange = (e: any) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className="post">
      {loadingData ? (
        <div className="loaderinpostupdatediv">
          <Loader />
        </div>
      ) : (
        <>
          <h1>Edit your profile : </h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name : </label>
            <br />
            <Input
              type="text"
              value={data?.name}
              onChange={handleInputChange}
              id="name"
              required
              name="name"
            >
              Name
            </Input>
            <br />
            <label htmlFor="bio"> Bio : </label>
            <br />
            <Textarea
              id="bio"
              required
              name="bio"
              value={data?.bio}
              onChange={handleInputChange}
            >
              Enter your thought
            </Textarea>
            <br />
            <label htmlFor="bio"> Profile Image : </label>
            <br />{" "}
            {file && (
              <div className="pfpdiv">
                <Image
                  src={URL.createObjectURL(file)}
                  alt=""
                  width={60}
                  height={60}
                />
                <p>{file.name}</p>
                <label
                  className="custom-file-label"
                  onClick={() => {
                    setFile(null);
                    const fileInput = document.getElementById("file");
                    if (fileInput && fileInput instanceof HTMLInputElement) {
                      fileInput.value = ""; // Clear the input
                    }
                  }}
                >
                  <span>Remove Image</span>
                </label>
              </div>
            )}
            <div className="file-input-wrapper">
              <label htmlFor="fileInput" className="custom-file-label">
                <span>Select File</span>
              </label>
              <input
                type="file"
                id="fileInput"
                onChange={handleChange}
                className="custom-file-input"
              />
            </div>
            <br />
            <Button
              type="submit"
              style={
                loading || uploading
                  ? {
                      height: "40px",
                      width: "209px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      padding: "10px",
                    }
                  : {}
              }
              onClick={handleSubmit}
            >
              {(uploading || loading) && (
                <div
                  style={{
                    width: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Loader size={0.5} white />
                </div>
              )}
              {uploading
                ? "Uploading Image..."
                : loading
                ? "Updating profile..."
                : "Update"}
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default page;
