import Image from "next/image";
import React from "react";
import githubIcon from "../../../public/icons/gitsvg.svg";
import notionIcon from "../../../public/icons/notionsvg.svg";
import Link from "next/link";
import { BiMessageEdit } from "react-icons/bi";
import { useStore } from "zustand";
import { useModalStore } from "@/stores/modalStore";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const Footer = () => {
  const { openModal } = useStore(useModalStore);
  const { data: session } = useSession();

  const openFeedbackForm = () => {
    if (!session?.user) {
      openModal("signin");
      toast.info("로그인이 필요한 서비스입니다.");
    } else {
      openModal("feedback");
    }
  };
  return (
    <div className="none:container h-[118px] border-solid border-2 border-gray-200 bg-gray-100">
      <div className="footer-content text-slate-500">
        <h2 className="mt-5 pb-[5px] text-[22px] text-center font-bold">
          Spotlight
        </h2>
        <p className="text-sm text-center font-medium pb-2.5">
          Spotlight를 통해 일상 속 특별함을 더하세요!
        </p>
        <div className="mb-5 flex link-box">
          <div className="m-auto flex items-center">
            <Link
              href={"https://github.com/Programmers-SpotLight/SpotLight"}
              className="mr-2"
            >
              <Image
                src={githubIcon}
                alt={"github image"}
                width={20}
                height={20}
              />
            </Link>
            <Link
              href={
                "https://www.notion.so/prgrms/95a04e9503c849a292bdf04f7fcf50e2"
              }
              className="mr-2"
            >
              <Image
                src={notionIcon}
                alt={"github image"}
                width={20}
                height={20}
              />
            </Link>
            <span className="text-xl pb-1">&nbsp;|&nbsp;&nbsp;</span>
            <div
              onClick={openFeedbackForm}
              className="flex items-center cursor-pointer"
            >
              <BiMessageEdit size={25} className="pr-[2px]" />
              <span className="text-sm pb-[3px]">문의하기</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
