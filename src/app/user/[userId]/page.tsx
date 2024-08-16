"use client";

import React from "react";
import UserSelectionList from "@/components/user/my/UserSelectionSection";
import { useUserPage } from "@/context/UserPageContext";

const UserPage = () => {
  const { isMyPage } = useUserPage();
  return (
    <div
      className={
        isMyPage
          ? "flex flex-col justify-center items-center w-full mt-5"
          : "w-[800px] m-auto my-5"
      }
    >
      <UserSelectionList />
    </div>
  );
};

export default UserPage;
