import { TModalSize } from "@/models/modal";
import React, { ReactNode } from "react";
import { IoClose } from "react-icons/io5";

interface ModalProps {
  size: TModalSize;
  title: string;
  children: ReactNode;
  closeModal: () => void;
}

const MODAL_WIDTH = {
  small : "335px",
  medium : "514px",
  large : "691px"
}

const Modal = ({ size, title, children, closeModal }: ModalProps) => {
  const getModalSize = () => {
    switch (size) {
      case "small":
        return `w-[${MODAL_WIDTH.small}]`;
      case "medium":
        return `w-[${MODAL_WIDTH.medium}]`;
      case "large":
        return `w-[${MODAL_WIDTH.large}]`;
      default:
        return "";
    }
  };

  return (
    <div
      className={`bg-white rounded p-5 ${getModalSize()} relative max-h-[980px] overflow-y-auto`}
    >
      <div className="flex justify-between items-center mb-4">
        {size !== "small" && (
          <div className="mt-[10px] font-bold text-extraLarge">{title}</div>
        )}
        <IoClose
          className="top-[10px] right-[10px] absolute w-6 h-6"
          style={{ color: "#063D60" }}
          onClick={closeModal}
        />
      </div>
      {size !== "small" && <hr className="mt-4 mb-4" />}
      <div>{children}</div>
    </div>
  );
};

export default Modal;
