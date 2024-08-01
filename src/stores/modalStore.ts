import { TmodalType } from "@/models/modal";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface IModalStore {
  isOpen: boolean;
  modalType : TmodalType
  openModal: (modalType : TmodalType) => void;
  closeModal: () => void;
}

export const useModalStore = create<IModalStore>()(
  devtools((set) => ({
    isOpen: false,
    modalType : null,
    openModal: (modalType : TmodalType = null) => 
      set({ isOpen: true, modalType: modalType }),
    closeModal: () => set({ isOpen: false, modalType: null})
  }))
);
