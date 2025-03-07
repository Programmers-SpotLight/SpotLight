"use client";

import { useModalStore } from "@/stores/modalStore";
import React from "react";
import { useStore } from "zustand";
import Modal from "./Modal";
import ModalCreateSelectionSpot from "./modal-contents/ModelCreateSelectionSpot/ModalCreateSelectionSpot";
import { APIProvider } from "@vis.gl/react-google-maps";
import SpotImages from "@/components/selection-detail/spot-selection-contents/SpotImages";
import { TModalSize, TmodalType } from "@/models/modal.model";
import ModalEditTag from "./modal-contents/ModalEditTag";
import ModalFeedbackForm from "./modal-contents/ModalFeedbackForm";
import ReviewDeleteModal from "./modal-contents/review/ReviewDeleteModal";
import ReviewModal from "./modal-contents/review/ReviewModal";
import ModalEditInfo from "./modal-contents/ModalEditInfo";
import ModalSelectionDelete from "./modal-contents/ModalSelectionDelete";
import ModalSignIn from "../../users/ModalSignIn";
import ModalSignUp from "@/components/users/ModalSignUp";

interface ImodalDatas {
  type: TmodalType;
  title: string;
  size: TModalSize;
  overlayClose: boolean;
  component: React.ComponentType<any>;
}

const modalDatas: ImodalDatas[] = [
  {
    type: "signin",
    title: "모달 로그인",
    size: "small",
    overlayClose: true,
    component: ModalSignIn
  },
  {
    type: "signup",
    title: "모달 회원가입",
    size: "small",
    overlayClose: true,
    component: ModalSignUp
  },
  {
    type: "GoogleMapsAddSelectionSpot",
    title: "스팟 추가",
    size: "large",
    overlayClose: false,
    component: ModalCreateSelectionSpot
  },
  {
    type: "images",
    title: "스팟 이미지",
    size: "full",
    overlayClose: true,
    component: SpotImages
  },
  {
    type: "editTag",
    title: "관심 태그 편집",
    size: "medium",
    overlayClose: true,
    component: ModalEditTag
  },
  {
    type: "feedback",
    title: "유저의 소리",
    size: "large",
    overlayClose: false,
    component: ModalFeedbackForm
  },
  {
    type: "review",
    title: "리뷰",
    size: "medium",
    overlayClose: false,
    component: ReviewModal
  },
  {
    type: "review-delete",
    title: "",
    size: "small",
    overlayClose: false,
    component: ReviewDeleteModal
  },
  {
    type: "editInfo",
    title: "자기소개 편집",
    size: "medium",
    overlayClose: true,
    component: ModalEditInfo
  },
  {
    type: "selection-delete",
    title: "셀렉션 삭제",
    size : "small",
    overlayClose : true,
    component : ModalSelectionDelete
  }
];

const ModalController = () => {
  const { isOpen, closeModal, modalType, props } = useStore(useModalStore);
  if (!isOpen) return null;

  const findModal = modalDatas.find((modal) => modal.type === modalType);
  if (!findModal) return null;

  const { title, size, overlayClose, component: Component } = findModal;

  const handleOverlayClick = () => {
    closeModal();
  };

  return (
    <div
      className={`flex justify-center items-center fixed inset-0 bg-black ${
        modalType === "images" ? "bg-opacity-90" : "bg-opacity-50"
      } z-20`}
      onClick={overlayClose ? handleOverlayClick : undefined}
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <Modal title={title} size={size} closeModal={closeModal}>
          {/* 모달의 이름이 googleMaps로 시작한다면 구글맵 APIProvider를 사용 */}
          {modalType?.startsWith("GoogleMaps") ? (
            <APIProvider
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
            >
              <Component {...props} />
            </APIProvider>
          ) : (
            <Component {...props} />
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ModalController;
