"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { IoPersonSharp, IoSearchOutline } from "react-icons/io5";
import AutoCompletion from "../search/search-contents/AutoCompletion";
import useClickOutside from "@/hooks/useClickOutside";
import useSearchAutoComplete from "@/hooks/useSearchAutoComplete";
import { useModalStore } from "@/stores/modalStore";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import useCheckSignUpParams from "@/hooks/useCheckSignUpParams";
import { toast } from "react-toastify";
import { Session } from "next-auth";

const Header = () => {
  const router = useRouter();
  const [tagValue, setTagValue] = useState<string>("");
  const [isDropDownVisible, setIsDropDownVisible] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLImageElement>(null);
  const {
    tagInputRef,
    tagACRef,
    handleKeyDown,
    visibleAutoCompletion,
    setVisibleAutoCompletion
  } = useSearchAutoComplete();
  useClickOutside(dropdownRef, () => setIsDropDownVisible(false));
  const { openModal } = useModalStore();
  const { data: session, status } = useSession();
  const imageUrl = session?.user?.image ? session?.user?.image : "";

  useCheckSignUpParams();

  const onClickHandler = () => {
    setIsDropDownVisible((prev) => !prev);
  };

  const onSubmithandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const addTag = tagValue.replace(/\s+/g, "");
    if (addTag.length === 0) {
      toast.error("해시태그를 입력해주세요.");
      setTagValue("");
      return false;
    }
    if (addTag.length > 40) {
      toast.error("40글자 이내로 작성해주세요");
      setTagValue("");
      return false;
    }
    setTagValue("");
    setVisibleAutoCompletion(false);
    router.push(`/search?tags=${tagValue}`);
  };

  // SNS Login / Sign in
  const handleSignout = () => {
    signOut();
  };

  const handleOpenModal = () => {
    openModal("signin");
  };

  useEffect(() => {
  }, [session]);

  return (
    <div className="w-full h-[74px] bg-grey0 shadow-md px-6 flex items-center justify-between">
      <Link href={"/"}>
        <span className="text-primary text-large font-bold">Spotlight</span>
      </Link>

      <div className="relative w-[640px]">
        <form onSubmit={onSubmithandler}>
          <input
            className="w-full h-[50px] border-[0.5px] border-solid border-grey2 rounded-3xl px-12 text-center placeholder:text-grey4 font-bold outline-primary"
            placeholder={`혹시 찾으시는 셀렉션이 있으신가요?`}
            value={tagValue}
            onChange={(e) => {
              setTagValue(e.target.value);
              setVisibleAutoCompletion(true);
            }}
            ref={tagInputRef}
            onKeyDown={handleKeyDown}
          />
        </form>
        <IoSearchOutline
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-grey4"
          size={24}
        />
        {visibleAutoCompletion && (
          <AutoCompletion
            tagValue={tagInputRef.current ? tagInputRef.current.value : null}
            setTagValue={setTagValue}
            tagACRef={tagACRef}
            tagInputRef={tagInputRef}
            setVisibleAutoCompletion={setVisibleAutoCompletion}
          />
        )}
      </div>
      {
        /**로그인 X */
        !session && (
          <button
            className="text-grey2 font-semibold w-[70px] h-[40px] rounded-xl bg-primary"
            onClick={handleOpenModal}
          >
            로그인
          </button>
        )
      }
      {
        /**로그인 O */
        /** user image가 있으면 */
        !!session && session.user?.image && (
          <Image
            ref={profileRef}
            src={imageUrl}
            alt="user"
            width={55}
            height={55}
            className="rounded-full cursor-pointer relative"
            onClick={onClickHandler}
          />
        )
      }
      {
        /**로그인 O */
        /** user image가 없으면  */
        !!session && !session.user?.image && (
          <div
            ref={profileRef}
            className="w-[55px] h-[55px] rounded-full cursor-pointer bg-grey1 flex items-center justify-center"
            onClick={onClickHandler}
          >
            <IoPersonSharp size={30} className="text-primary" />
          </div>
        )
      }

      {isDropDownVisible && (
        <div
          ref={dropdownRef}
          className="w-[200px] h-[100px] border-[0.5px] bg-grey0 border-solid border-grey2 absolute top-20 right-5 shadow-xl px-3 rounded-xl text-medium text-grey4 z-20"
        >
          <Link
            href={`/user/${session?.user.id}`}
            className="h-1/2 flex items-center text-medium text-grey4 hover:text-primary"
          >
            마이페이지
          </Link>
          <hr className="w-full" />
          <button
            className="w-full h-1/2 flex items-center text-medium text-grey4 hover:text-primary"
            onClick={handleSignout}
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
