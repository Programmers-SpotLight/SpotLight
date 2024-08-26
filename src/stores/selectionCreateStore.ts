import { TPoiWithAddress } from "@/components/selection-create/PoiMarkers";
import { ISelectionCategory, ISelectionSpot } from "@/models/selection.model";
import { create } from "zustand";
import { devtools } from "zustand/middleware";


interface ISelectionCreateStore {
  id: number;
  isTemporary: boolean;
  title: string;
  description: string;
  category: ISelectionCategory | undefined;
  location: ISelectionCreateStoreLocation | undefined;
  subLocation: ISelectionCreateStoreLocation | undefined;
  selectionImage: File | string | null;
  spots: Array<ISelectionSpot>;
  hashtags: string[];
  spotCategories: { id: number; name: string }[];
  setId: (id: number) => void;
  setIsTemporary: (isTemporary: boolean) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setCategory: (category: ISelectionCategory | undefined) => void;
  setLocation: (location: ISelectionCreateStoreLocation | undefined) => void;
  setSubLocation: (subLocation: ISelectionCreateStoreLocation | undefined) => void;
  setSelectionImage: (selectionPhoto: File | string | null) => void;
  addSpot: (spot: ISelectionSpot) => void;
  deleteSpot: (spot: number) => void;
  setSpots: (spots: ISelectionSpot[]) => void;
  addHashtag: (tag: string) => void;
  deleteHashtag: (tag: string) => void;
  setHashtags: (hashtags: string[]) => void;
  updateSpot: (index: number, spot: ISelectionSpot) => void;
  setSpotCategories: (spotCategories: { id: number; name: string }[]) => void;
  reset: () => void;
}

interface ISelectionSpotCreateStore {
  placeName: string;
  address: string;
  currentCoordinate: google.maps.LatLngLiteral;
  title: string;
  description: string;
  category: ISelectionCategory | undefined;
  selectedLocation: TPoiWithAddress;
  spotImage: File | string | null;
  spotImage1: File | string | null;
  spotImage2: File | string | null;
  spotImage3: File | string | null;
  hashtags: string[];
  setPlaceName: (placeName: string) => void;
  setAddress: (address: string) => void;
  setCurrentCoordinate: (currentCoordinate: google.maps.LatLngLiteral) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setCategory: (category: ISelectionCategory | undefined) => void;
  setSelectedLocation: (selectedLocation: TPoiWithAddress) => void;
  setSpotDescription: (description: string) => void;
  setSpotImage: (spotImage: File | string | null) => void;
  setSpotImage1: (spotImage1: File | string | null) => void;
  setSpotImage2: (spotImage2: File | string | null) => void;
  setSpotImage3: (spotImage3: File | string | null) => void;
  addHashtag: (tag: string) => void;
  deleteHashtag: (tag: string) => void;
  reset: () => void;
}

interface ISelectionCreateStoreLocation {
  id : number;
  name: string;
}

export const useSelectionCreateStore = create<ISelectionCreateStore>()(
  devtools((set) => ({
    id: 0,
    isTemporary: false,
    title: "",
    description: "",
    category: undefined,
    location: undefined,
    subLocation: undefined,
    selectionImage: null,
    spots: [],
    hashtags: [],
    spotCategories: [],
    setId: (id: number) => set({ id }),
    setIsTemporary: (isTemporary: boolean) => set({ isTemporary }),
    setTitle: (title: string) => set({ title }),
    setDescription: (description: string) => set({ description }),
    setCategory: (category: ISelectionCategory | undefined) => set({ category }),
    setLocation: (location: ISelectionCreateStoreLocation | undefined) => set({ location }),
    setSubLocation: (subLocation: ISelectionCreateStoreLocation | undefined) => set({ subLocation }),
    setSelectionImage: (selectionImage: File | string | null) => set({ selectionImage }),
    addSpot: (spot: ISelectionSpot) => set((state) => ({ spots: [...state.spots, spot] })),
    addHashtag: (hashtag: string) => {
      if (typeof hashtag !== "string") return;
      set(
        (state) => ({ hashtags: [...state.hashtags, hashtag] })
      )
    },
    setHashtags: (hashtags: string[]) => set({ hashtags }),
    deleteSpot: (index: number) => set(
      (state) => ({ spots: state.spots.filter((_, i) => i !== index) })
    ),
    setSpots: (spots: ISelectionSpot[]) => set({ spots }),
    deleteHashtag: (hashtag: string) => {
      if (typeof hashtag !== "string") return;
      set(
        (state) => ({ hashtags: state.hashtags.filter((t) => t !== hashtag)})
      )
    },
    updateSpot: (index: number, spot: ISelectionSpot) => set(
      (state) => ({ spots: state.spots.map((s, i) => i === index ? spot : s) })
    ),
    setSpotCategories: (spotCategories: { id: number; name: string }[]) => set({ spotCategories }),
    reset: () => set({
      title: "",
      description: "",
      category: undefined,
      location: undefined,
      subLocation: undefined,
      selectionImage: null,
      spots: [],
      hashtags: []
    })
  }))
);

export const useSelectionSpotCreateStore = create<ISelectionSpotCreateStore>()(
  devtools((set) => ({
    placeName: "",
    address: "",
    currentCoordinate: { lat: 37.5503, lng: 126.9971 },
    title: "",
    description: "",
    category: undefined,
    selectedLocation: {
      key: "User's current location",
      location: { lat: 37.5503, lng: 126.9971 },
      address: "",
      placeId: "",
    },
    spotImage: null,
    spotImage1: null,
    spotImage2: null,
    spotImage3: null,
    hashtags: [],
    setPlaceName: (placeName: string) => set({ placeName }),
    setAddress: (address: string) => set({ address }),
    setCurrentCoordinate: (currentCoordinate: google.maps.LatLngLiteral) => set({ currentCoordinate }),
    setTitle: (title: string) => set({ title }),
    setDescription: (description: string) => set({ description }),
    setCategory: (category: ISelectionCategory | undefined) => set({ category }),
    setSelectedLocation: (selectedLocation: TPoiWithAddress) => set({ selectedLocation }),
    setSpotDescription: (description: string) => set({ description }),
    setSpotImage: (spotImage: File | string | null) => set({ spotImage }),
    setSpotImage1: (spotImage1: File | string | null) => set({ spotImage1 }),
    setSpotImage2: (spotImage2: File | string | null) => set({ spotImage2 }),
    setSpotImage3: (spotImage3: File | string | null) => set({ spotImage3 }),
    addHashtag: (hashtag: string) => {
      if (typeof hashtag !== "string") return;
      set(
        (state) => ({ hashtags: [...state.hashtags, hashtag] })
      )
    },
    deleteHashtag: (hashtag: string) => {
      if (typeof hashtag !== "string") return;
      set(
        (state) => ({ hashtags: state.hashtags.filter((t) => t !== hashtag)})
      )
    },
    reset: () => set({
      placeName: "",
      address: "",
      currentCoordinate: { lat: 37.5503, lng: 126.9971 },
      title: "",
      description: "",
      selectedLocation: {
        key: "User's current location",
        location: { lat: 37.5503, lng: 126.9971 },
        address: "",
        placeId: "",
      },
      spotImage: null,
      spotImage1: null,
      spotImage2: null,
      spotImage3: null,
      hashtags: []
    })
  }))
);