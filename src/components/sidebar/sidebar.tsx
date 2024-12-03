"use client";
import React, { useEffect, useState } from "react";
import "./sidebar.css";
import Icon from "../hamburger/hamburger";
import { getCookie } from "@/utils/utils";
import { getFollowed } from "@/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loader from "../loader/loader";

const sidebar = () => {
  const id = getCookie("user");
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [noFollowing, setNoFollowing] = useState<boolean>(false);
  const [data, setData] = useState([]);
  const getFollow = async () => {
    try {
      if (!id) return;
      setLoading(true);
      const answer = await getFollowed(id);
      if (answer.success) {
        if (answer.noFollowing) {
          setNoFollowing(true);
        } else {
          if (answer.data) {
            const data2 = await JSON.parse(answer.data);
            setData(data2);
          } else {
            toast.error(answer.message || "Somethig went wrong");
          }
        }
      } else {
        toast.error(answer.message || "Somethig went wrong");
      }
    } catch (e: any) {
      toast.error(e.message || "Somethig went wrong");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getFollow();
  }, []);
  return (
    <div className="sidebar">
      <h3>
        {" "}
        <Icon type="close" /> Following :{" "}
      </h3>
      {!id ? (
        <div className="user">
          <p>Please login</p>
        </div>
      ) : noFollowing ? (
        <div className="user">
          <p>Empty</p>
        </div>
      ) : loading ? (
        <div className="user">
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Loader size={0.5} />
          </div>
        </div>
      ) : data ? (
        data.map((item: any) => (
          <div
            className="user"
            key={item._id}
            onClick={() => {
              router.push("/profile/" + item._id);
            }}
          >
            <p>{item.name}</p>
            <p className="plus">{">"}</p>
          </div>
        ))
      ) : (
        <div className="user">
          <p>Something went wrong !</p>
        </div>
      )}
    </div>
  );
};

export default sidebar;
