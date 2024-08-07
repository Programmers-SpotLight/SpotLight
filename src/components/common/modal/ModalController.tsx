"use client";

import { useModalStore } from "@/stores/modalStore";
import React from "react";
import { useStore } from "zustand";
import Modal from "./Modal";
import ModalTemp from "./modal-contents/ModalTemp";
import { TModalSize, TmodalType } from "@/models/modal";
import ModalCreateSelectionSpot from "./modal-contents/ModalCreateSelectionSpot";
import { APIProvider } from "@vis.gl/react-google-maps";
import SpotImages from "@/components/selection-detail/spot-selection-contents/SpotImages";

interface ImodalDatas {
  type: TmodalType;
  title: string;
  size: TModalSize;
  overlayClose: boolean;
  component: React.ComponentType<any>;
}

const modalDatas: ImodalDatas[] = [
  {
    type: "temp",
    title: "모달 테스트",
    size: "medium",
    overlayClose: true,
    component: ModalTemp
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
