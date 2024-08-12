import Image from "next/image";
import React from "react";

interface IUserInfoProps {
  image: string;
  nickname: string;
  description: string;
}

const UserInfo = ({ image, nickname, description }: IUserInfoProps) => {
  return (
    <div className="flex w-[392px] gap-5 justify-center">
      <div className="w-[100px] h-[100px] relative rounded-full flex-shrink-0">
        <Image src={image} fill alt={nickname} className="rounded-full" />
      </div>

      <div className="flex flex-col items-start justify-end gap-2">
        <span className="font-bold text-large">{nickname}님</span>
        <p className="text-grey4 break-keep">{description}</p>
      </div>
    </div>
  );
};

export default UserInfo;
