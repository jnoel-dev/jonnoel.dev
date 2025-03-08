import React from "react";

interface TitleBarProps {
  title: string;
}

export default function TitleBar({ title }: TitleBarProps) {
  return (
    <h1 className="flex items-center justify-center w-full text-xl">
      <span className="flex-1 border-t border-current"></span>
      <span className="px-2 text-[24px]">{title}</span>
      <span className="flex-1 border-t border-current"></span>
    </h1>
  );
}
