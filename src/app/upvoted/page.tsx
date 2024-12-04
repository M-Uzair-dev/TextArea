import React from "react";
import "../home.css";
import Bottombar from "@/components/bottombar/bottombar";
import Cards from "@/components/cards/cards";
import Icon from "@/components/hamburger/hamburger";

export const metadata = {
  title: "Upvoted posts - Thoughts Area",
  description:
    "A place where you can openly share your most random thoughts and see other people's opinion about it.",
};
const Home = () => {
  return (
    <div className="home">
      <h3 className="mainheading">
        <Icon type="open" />
        Most Upvoted :{" "}
      </h3>
      <Cards page="upvoted" />
      <Bottombar page="trending" />
    </div>
  );
};

export default Home;
