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
import ModalEditInfo from "./modal-contents/ModalEditInfo";
import ModalUser from "../../users/ModalUser";

interface ImodalDatas {
  type: TmodalType;
  title: string;
  size: TModalSize;
  overlayClose: boolean;
  component: React.ComponentType<any>;
}

const modalDatas: ImodalDatas[] = [
  {
    type: "login",
    title: "모달 로그인",
    size: "small",
    overlayClose: true,
    component: ModalUser
  },
  {
    type: "GoogleMapsAddSelectionSpot",
    title: "스팟 추가",
    size: "large",
    overlayClose: true,
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
    overlayClose: true,
    component: ModalFeedbackForm
  },
  {
    type: "editInfo",
    title: "자기소개 편집",
    size: "medium",
    overlayClose: true,
    component: ModalEditInfo
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
