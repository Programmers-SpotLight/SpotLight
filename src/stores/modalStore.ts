import { TmodalType } from "@/models/modal";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface IModalStore {
  isOpen: boolean;
  modalType: TmodalType;
  props?: object | null;
  openModal: <T extends object>(modalType: TmodalType, props?: T) => void;
  closeModal: () => void;
}

export const useModalStore = create<IModalStore>()(
  devtools((set) => ({
    isOpen: false,
    modalType: null,
    props: null,
    openModal: <T extends object>(modalType: TmodalType, props?: T) =>
      set({ isOpen: true, modalType, props: props || null }),
    closeModal: () => set({ isOpen: false, modalType: null, props: null }),
  }))
);
