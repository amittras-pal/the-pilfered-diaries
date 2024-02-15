import React from "react";

interface DividerProps {
  direction: "horizontal" | "vertical";
  className?: string;
}

export default function Divider({ direction, className = "" }: DividerProps) {
  return (
    <div
      className={`bg-gray-700 ${className}`}
      style={{
        height: direction === "vertical" ? "100%" : "1px",
        width: direction === "horizontal" ? "100%" : "1px",
      }}
    />
  );
}
