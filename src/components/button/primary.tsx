import React from "react";
import "./button.css";
const primary = ({
  children,
  className,
  type,
  style,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
}) => {
  return (
    <button
      style={style}
      type={type ? type : "button"}
      className={`button ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default primary;
