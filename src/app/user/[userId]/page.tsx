"use client";

import React from "react";
import UserSelectionList from "@/components/user/my/UserSelectionSection";

const UserPage = () => {
  const isMypage = true;
  return (
    <div
      className={
        isMypage
          ? "flex flex-col justify-center items-center w-full mt-5"
          : "w-[800px] m-auto my-5"
      }
    >
      <UserSelectionList isMyPage={isMypage} />
    </div>
  );
};

export default UserPage;
