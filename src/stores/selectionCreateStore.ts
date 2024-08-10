import { ISelectionCategory, ISelectionSpot } from "@/models/selection.model";
import { create } from "zustand";
import { devtools } from "zustand/middleware";


interface ISelectionCreateStore {
  title: string;
  description: string;
  category: ISelectionCategory | undefined;
  location: ISelectionCreateStoreLocation | undefined;
  subLocation: ISelectionCreateStoreLocation | undefined;
  selectionPhoto: File | string | null;
  spots: Array<ISelectionSpot>;
  hashtags: string[];
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setCategory: (category: ISelectionCategory) => void;
  setLocation: (location: ISelectionCreateStoreLocation) => void;
  setSubLocation: (subLocation: ISelectionCreateStoreLocation) => void;
  setSelectionPhoto: (selectionPhoto: File | string) => void;
  addSpot: (spot: ISelectionSpot) => void;
  deleteSpot: (spot: number) => void;
  addHashtag: (tag: string) => void;
  deleteHashtag: (tag: string) => void;
  updateSpot: (index: number, spot: ISelectionSpot) => void;
}

interface ISelectionCreateStoreLocation {
  id : number;
  name: string;
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
    hashtags: [],
    setTitle: (title: string) => set({ title }),
    setDescription: (description: string) => set({ description }),
    setCategory: (category: ISelectionCategory) => set({ category }),
    setLocation: (location: ISelectionCreateStoreLocation) => set({ location }),
    setSubLocation: (subLocation: ISelectionCreateStoreLocation) => set({ subLocation }),
    setSelectionPhoto: (selectionPhoto: File | string) => set({ selectionPhoto }),
    addSpot: (spot: ISelectionSpot) => set((state) => ({ spots: [...state.spots, spot] })),
    addHashtag: (hashtag: string) => {
      if (typeof hashtag !== "string") return;
      set(
        (state) => ({ hashtags: [...state.hashtags, hashtag] })
      )
    },
    deleteSpot: (index: number) => set(
      (state) => ({ spots: state.spots.filter((_, i) => i !== index) })
    ),
    deleteHashtag: (hashtag: string) => {
      if (typeof hashtag !== "string") return;
      set(
        (state) => ({ hashtags: state.hashtags.filter((t) => t !== hashtag)})
      )
    },
    updateSpot: (index: number, spot: ISelectionSpot) => set(
      (state) => ({ spots: state.spots.map((s, i) => i === index ? spot : s) })
    ),
  }))
);