import React from "react";
import "../../home.css";
import Bottombar from "@/components/bottombar/bottombar";
import Cards from "@/components/cards/cards";
import Icon from "@/components/hamburger/hamburger";
const Home = ({ params }: { params: any }) => {
  return (
    <div className="home">
      <h3 className="mainheading">
        <Icon type="open" />
        Search for term : {params.term}
      </h3>
      <Cards page="search" term={params.term} />
      <Bottombar page="foryou" />
    </div>
  );
};

export default Home;
