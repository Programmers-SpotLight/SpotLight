import { ISelectionSpot } from "@/models/selection.model";
import { create } from "zustand";
import { devtools } from "zustand/middleware";


interface ISelectionCreateStore {
  title: string;
  description: string;
  category: number | undefined;
  location: number | undefined;
  subLocation: number | undefined;
  selectionPhoto: File | string | null;
  spots: Array<ISelectionSpot>;
  tags: string[];
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setCategory: (category: number) => void;
  setLocation: (location: number) => void;
  setSubLocation: (subLocation: number) => void;
  setSelectionPhoto: (selectionPhoto: File) => void;
  addSpot: (spot: ISelectionSpot) => void;
  deleteSpot: (spot: number) => void;
  addTag: (tag: string) => void;
  deleteTag: (tag: string) => void;
}

export const useSelectionCreateStore = create<ISelectionCreateStore>()(
  devtools((set) => ({
    title: "",
    description: "",
    category: undefined,
    location: undefined,
    subLocation: undefined,
    selectionPhoto: null,
    spots: [],
    tags: [],
    setTitle: (title: string) => set({ title }),
    setDescription: (description: string) => set({ description }),
    setCategory: (category: number) => set({ category }),
    setLocation: (location: number) => set({ location }),
    setSubLocation: (subLocation: number) => set({ subLocation }),
    setSelectionPhoto: (selectionPhoto: File) => set({ selectionPhoto }),
    addSpot: (spot: ISelectionSpot) => set((state) => ({ spots: [...state.spots, spot] })),
    addTag: (tag: string) => set((state) => ({ tags: [...state.tags, tag] })),
    deleteSpot: (index: number) => set((state) => ({ spots: state.spots.filter((_, i) => i !== index) })),
    deleteTag: (tag: string) => set((state) => ({ tags: state.tags.filter((t) => t !== tag)})),
  }))
);