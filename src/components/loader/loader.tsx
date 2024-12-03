import React from "react";
import "./loader.css";

const loader = ({
  size,
  invert,
  white,
}: {
  size?: number;
  invert?: boolean;
  white?: boolean;
}) => {
  return (
    <svg
      viewBox="25 25 50 50"
      className="container"
      style={
        invert
          ? { scale: size || "1", filter: "invert(1)" }
          : { scale: size || "1" }
      }
    >
      <circle
        cx="50"
        cy="50"
        r="20"
        style={white ? { stroke: "#fff" } : {}}
        className="loader"
      ></circle>
    </svg>
  );
};

export default loader;
