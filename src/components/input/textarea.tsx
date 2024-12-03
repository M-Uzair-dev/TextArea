"use client";
import React from "react";
import "./input.css";
import { ChangeEvent } from "react";

const input = ({
  children,
  style,
  onChange,
  value,
  name,
  id,
  required,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  value?: string;
  name?: string;
  id?: string;
  required?: boolean;
}) => {
  return (
    <textarea
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
