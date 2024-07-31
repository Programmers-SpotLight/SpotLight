import { TModalSize } from "@/components/common/modal/Modal"; // 경로를 확인하세요
import { ReactNode } from "react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface IModalStore {
  isOpen: boolean;
  modalTitle: string;
  modalSize: TModalSize;
  modalContents: ReactNode;
  openModal: (title: string, size: TModalSize, contents: ReactNode) => void;
  closeModal: () => void;
}

export const useModalStore = create<IModalStore>()(
  devtools((set) => ({
    isOpen: false,
    modalTitle: "",
    modalSize: "medium",
    modalContents: null,
    openModal: (title: string, size: TModalSize = "medium", contents: ReactNode = null) => 
      set({ isOpen: true, modalTitle: title, modalSize: size, modalContents: contents }),
    closeModal: () => set({ isOpen: false, modalTitle: "", modalSize: "medium", modalContents: null })
  }))
);
