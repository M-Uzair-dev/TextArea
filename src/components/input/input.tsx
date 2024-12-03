"use client";
import React from "react";
import "./input.css";

const input = ({
  children,
  type,
  style,
  onChange,
  value,
  name,
  id,
  required,
}: {
  children: React.ReactNode;
  type: "text" | "password" | "email" | "number";
  style?: React.CSSProperties;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  name?: string;
  id?: string;
  required?: boolean;
}) => {
  return (
    <input
      type={type}
      style={style}
      placeholder={children as string}
      className="inputcomponent"
      onChange={onChange}
      value={value}
      name={name}
      id={id}
      required
    />
  );
};

export default input;
