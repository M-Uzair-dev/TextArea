import React from "react";
import "../home.css";
import Bottombar from "@/components/bottombar/bottombar";
import Cards from "@/components/cards/cards";
import Icon from "@/components/hamburger/hamburger";
const Home = () => {
  return (
    <div className="home">
      <h3 className="mainheading">
        <Icon type="open" />
        Most Downvoted :{" "}
      </h3>
      <Cards page="downvoted" />
      <Bottombar page="disliked" />
    </div>
  );
};

export default Home;
