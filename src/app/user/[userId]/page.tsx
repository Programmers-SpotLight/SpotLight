"use client";

import React from "react";
import UserSelectionList from "@/components/user/my/UserSelectionSection";

const UserPage = () => {
  const isMypage = false;
  return (
    <>
      {isMypage ? (
        <div className="flex flex-col justify-center items-center w-full mt-5">
          <UserSelectionList isMyPage={isMypage} />
        </div>
      ) : (
        <div className="w-[800px] m-auto my-5">
          <UserSelectionList/>
        </div>
      )}
    </>
  );
};

export default UserPage;
