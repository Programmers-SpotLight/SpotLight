import Image from "next/image";
import React from "react";
import { GoPencil } from "react-icons/go";

interface IUserInfoProps {
  image?: string;
  nickname: string;
  description: string;
  isMyPage: boolean;
}

const UserInfo = ({
  image,
  nickname,
  description,
  isMyPage
}: IUserInfoProps) => {
  return (
    <div className="flex w-[392px] gap-5 justify-center">
      <div className="w-[100px] h-[100px] relative rounded-full flex-shrink-0">
        {
          image ? <Image src={image} fill alt={nickname} className="rounded-full object-cover" />
          : <div className="w-full  h-full rounded-full bg-grey3"/> 
        }
      </div>

      <div className="flex flex-col items-start justify-end gap-2">
        <span className="font-extrabold text-large">{nickname}님</span>
        <p className="text-grey4 break-keep relative text-small">
          {description}
          <span className="absolute bottom-0 right-0 cursor-pointer">
            {isMyPage && <GoPencil />}
          </span>
        </p>
      </div>
    </div>
  );
};

export default UserInfo;
