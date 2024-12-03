"use client";

import Image from "next/image";
import React from "react";
import icon from "../../../public/hamburger.png";
import close from "../../../public/close.png";

const hamburger = ({ type }: { type: "open" | "close" }) => {
  return type == "open" ? (
    <Image
      onClick={() => {
        document?.querySelector(".sidebar")?.classList.add("active");
      }}
      className="hamburger"
      src={icon}
      alt="logo"
      width={20}
      height={20}
    />
  ) : (
    <Image
      onClick={() => {
        document?.querySelector(".sidebar")?.classList.remove("active");
      }}
      className="hamburger"
      src={close}
      alt="logo"
      width={20}
      height={20}
    />
  );
};

export default hamburger;
