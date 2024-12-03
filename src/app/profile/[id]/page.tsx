"use client";

import React, { useEffect, useState, use } from "react";
import "../profile.css";
import Button from "@/components/button/primary";
import Cards from "@/components/cards/cards";
import { getUser, toggleFollow } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getCookie } from "@/utils/utils";
import Loader from "@/components/loader/loader";

const page = ({ params }: { params: any }) => {
  let [userData, setUserData]: any = useState({});
  const [loading, setLoading] = useState(true);
  const { id }: any = use(params);
  const router = useRouter();
  const myId = getCookie("user");
  const [loadingFollow, setLoadingFollow] = useState(false);

  let getData = async () => {
    try {
      if (id) {
        const user = await getUser(id, myId);
        if (user.success && user.user) {
          setUserData(JSON.parse(user.user));
        } else {
          toast.error("Something is wrong");
          router.push("/");
        }
      } else {
        toast.error("Something is wrong");
        router.push("/");
      }
    } catch (e) {
      toast.error("Something is wrong");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [id]);
  function removeCookie(cookieName: string) {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
  const follow = async (e: any) => {
    try {
      e.stopPropagation();
      if (!myId) {
        toast.error("please login to follow !");
        return;
      }
      if (loadingFollow) {
        toast.error("loading, please wait...");
        return;
      }

      if (userData.isFollowing) {
        setUserData((prev: any) => ({
          ...prev,
          followers: prev.followers - 1,
        }));
      } else {
        setUserData((prev: any) => ({
          ...prev,
          followers: prev.followers + 1,
        }));
      }

      setUserData((prev: any) => ({
        ...prev,
        isFollowing: !prev.isFollowing,
      }));

      setLoadingFollow(true);
      let answer = await toggleFollow(myId, id);
      if (!answer.success) {
        toast.error(answer.message);
        setUserData((prev: any) => ({
          ...prev,
          isFollowing: !prev.isFollowing,
        }));
        return;
      }
    } catch (e: any) {
      toast.error(e.message || "Something went wrong !");
      setUserData((prev: any) => ({
        ...prev,
        isFollowing: !prev.isFollowing,
      }));
    } finally {
      setLoadingFollow(false);
    }
  };
  return (
    <div className="profilePage">
      <div className="mainTop">
        {loading ? (
          <div className="loader">
            <Loader />
          </div>
        ) : (
          <div className="leftTop">
            <div
              className="ProfilePic"
              style={
                userData?.pfp
                  ? {
                      backgroundImage: `url(${userData.pfp})`,
                      backgroundSize: "cover",
                    }
                  : {}
              }
            ></div>
            <div className="Userinfosection">
              <h1>{userData?.name || "user"}</h1>
              <h3>
                {userData?.followers || 0} Follower
                {userData?.followers > 1 || (userData?.followers == 0 && "s")}
              </h3>
              <p>{userData?.bio || "No bio"}</p>
              <button
                style={{
                  backgroundColor: "orangered",
                  color: "#fff",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  margin: "10px 0",
                }}
                onClick={() => {
                  let answer = confirm("Are you sure you want to logout ?");
                  if (!answer) return;
                  removeCookie("user");
                  router.push("/");
                  router.refresh();
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
        <div className="rightTop">
          {id == myId ? (
            <>
              <Button
                onClick={() => {
                  router.push(`/editprofile/${id}`);
                }}
                style={
                  loading
                    ? {
                        height: "40px",
                        width: "83px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }
                    : {}
                }
              >
                {loading ? <Loader size={0.5} white={true} /> : "Edit"}
              </Button>
            </>
          ) : (
            <Button
              onClick={follow}
              style={
                loading
                  ? {
                      height: "40px",
                      width: "98px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }
                  : {}
              }
            >
              {loading ? (
                <Loader size={0.5} white />
              ) : userData.isFollowing ? (
                "unfollow"
              ) : (
                "follow"
              )}
            </Button>
          )}
        </div>
      </div>
      <h2>User's Posts : </h2>
      <Cards page="profile" term={id} />
    </div>
  );
};

export default page;
