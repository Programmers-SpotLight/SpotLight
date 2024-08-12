"use client";

import React from "react";
import { FaUserLock } from "react-icons/fa";
import Button from "../common/button/Button";

const PrivateUser = () => {
  const onClick = () => {
    window.history.back();
  };
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-4">
      <FaUserLock size={80} />
      <span className="text-grey4 font-bold text-extraLarge">
        비공개 유저입니다.
      </span>
      <Button onClick={onClick}>이전으로</Button>
    </div>
  );
};

export default PrivateUser;
