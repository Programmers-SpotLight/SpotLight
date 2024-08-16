import { TModalSize } from "@/models/modal.model";
import React, { ReactNode } from "react";
import { IoClose } from "react-icons/io5";

interface ModalProps {
  size: TModalSize;
  title: string;
  children: ReactNode;
  closeModal: () => void;
}

const MODAL_WIDTH = {
  small: "335px",
  medium: "514px",
  large: "691px",
  full: "100vw"
};

const Modal = ({ size, title, children, closeModal }: ModalProps) => {
  const getModalSize = () => {
    switch (size) {
      case "small":
        return MODAL_WIDTH.small;
      case "medium":
        return MODAL_WIDTH.medium;
      case "large":
        return MODAL_WIDTH.large;
      case "full":
        return MODAL_WIDTH.full;
      default:
        return "auto";
    }
  };

  if (size === "full") {
    return (
      <div style={{ width: getModalSize() }}>
        <IoClose
          className="top-6 right-10 absolute w-12 h-12 cursor-pointer transition-transform duration-200 hover:scale-110 z-100"
          fill="white"
          onClick={closeModal}
        />
        {children}
      </div>
    );
  }

  return (
    <div
      style={{ width: getModalSize() }}
      className={` bg-white rounded p-5 relative max-h-[90vh] overflow-y-auto z-20`}
    >
      <div className="flex justify-between items-center mb-4">
        {size !== "small" && (
          <div className="mt-[10px] font-bold text-extraLarge">{title}</div>
        )}
        <IoClose
          className="top-[10px] right-[10px] absolute w-6 h-6 cursor-pointer transition-transform duration-200 hover:scale-110"
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
