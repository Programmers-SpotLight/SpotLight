import { TModalSize, TmodalType } from "@/models/modal.model";
import { useModalStore } from "@/stores/modalStore";
import React, { ReactNode } from "react";
import { useStore } from "zustand";
import { signIn } from "next-auth/react";
import Image from "next/image";
import kakaoButtonImg from "../../../public/imgs/login/kakao_login_medium_wide.png";
import googleButtonImg from "../../../public/imgs/google_web_light_sq_SI.svg";

interface ImodalDatas {
  type: TmodalType;
  title: string;
  size: TModalSize;
  overlayClose: boolean;
}

const modalDatas: ImodalDatas[] = [
  {
    type: "signin",
    title: "",
    size: "small",
    overlayClose: true
  }
];
const ModalSignIn = () => {
  const { isOpen, closeModal, modalType, props } = useStore(useModalStore);

  if (!isOpen) return null;

  const findModal = modalDatas.find((modal) => modal.type === modalType);

  if (!findModal) return null;

  const { title, size, overlayClose } = findModal;

  const handleOverlayClick = () => {
    closeModal();
  };

  const handleSignin = (provider: "kakao" | "google") => {
    signIn(provider, {
      redirect: false,
      callbackUrl: "http://localhost:3000"
    });
  };
  const handleGoogleSignin = () => {};

  return (
    <div
      className="text-center"
      onClick={overlayClose ? handleOverlayClick : undefined}
    >
      <div className="mb-8">
        <span className="text-primary text-large font-bold">Spotlight</span>
      </div>
      <Image
        src={googleButtonImg}
        alt="google sign in button"
        width={267}
        height={40}
        className="m-auto mb-2 cursor-pointer relative"
        onClick={() => handleSignin("google")}
      />
      <Image
        src={kakaoButtonImg}
        alt="kakao sign in button"
        width={267}
        height={40}
        className="m-auto cursor-pointer relative"
        onClick={() => handleSignin("kakao")}
      />
    </div>
  );
};

export default ModalSignIn;
