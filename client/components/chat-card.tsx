"use client";
import React, { useState } from "react";

export default function ChatCard({ id, name, message, active, handelClick }: { id: string, name: string, message: string, active: boolean, handelClick: any }) {
  return (
    <div
      onClick={() => handelClick(id)}
      className={` ${active ? "bg-dark-secondary p-6" : "p-6"
        } rounded-2xl my-1 cursor-pointer hover:bg-[#555]`}
    >
      <h1 className="text-xl mb-2">{name}</h1>
      <p className="text-xs">{message}</p>
    </div>
  );
}
