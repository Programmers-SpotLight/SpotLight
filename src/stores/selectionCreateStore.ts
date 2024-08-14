import { TPoiWithAddress } from "@/components/selection-create/PoiMarkers";
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
  spotCategories: { id: number; name: string }[];
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setCategory: (category: ISelectionCategory) => void;
  setLocation: (location: ISelectionCreateStoreLocation) => void;
  setSubLocation: (subLocation: ISelectionCreateStoreLocation) => void;
  setSelectionPhoto: (selectionPhoto: File | string) => void;
  addSpot: (spot: ISelectionSpot) => void;
  deleteSpot: (spot: number) => void;
  setSpots: (spots: ISelectionSpot[]) => void;
  addHashtag: (tag: string) => void;
  deleteHashtag: (tag: string) => void;
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
  category: ISelectionCategory | null;
  selectedLocation: TPoiWithAddress;
  spotPhoto: File | string | null;
  spotPhoto1: File | string | null;
  spotPhoto2: File | string | null;
  spotPhoto3: File | string | null;
  hashtags: string[];
  setPlaceName: (placeName: string) => void;
  setAddress: (address: string) => void;
  setCurrentCoordinate: (currentCoordinate: google.maps.LatLngLiteral) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setCategory: (category: ISelectionCategory) => void;
  setSelectedLocation: (selectedLocation: TPoiWithAddress) => void;
  setSpotDescription: (description: string) => void;
  setSpotPhoto: (spotPhoto: File | string) => void;
  setSpotPhoto1: (spotPhoto1: File | string) => void;
  setSpotPhoto2: (spotPhoto2: File | string) => void;
  setSpotPhoto3: (spotPhoto3: File | string) => void;
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
    title: "",
    description: "",
    category: undefined,
    location: undefined,
    subLocation: undefined,
    selectionPhoto: null,
    spots: [],
    hashtags: [],
    spotCategories: [],
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
      selectionPhoto: null,
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
    category: null,
    selectedLocation: {
      key: "User's current location",
      location: { lat: 37.5503, lng: 126.9971 },
      address: "",
      placeId: "",
    },
    spotPhoto: null,
    spotPhoto1: null,
    spotPhoto2: null,
    spotPhoto3: null,
    hashtags: [],
    setPlaceName: (placeName: string) => set({ placeName }),
    setAddress: (address: string) => set({ address }),
    setCurrentCoordinate: (currentCoordinate: google.maps.LatLngLiteral) => set({ currentCoordinate }),
    setTitle: (title: string) => set({ title }),
    setDescription: (description: string) => set({ description }),
    setCategory: (category: ISelectionCategory) => set({ category }),
    setSelectedLocation: (selectedLocation: TPoiWithAddress) => set({ selectedLocation }),
    setSpotDescription: (description: string) => set({ description }),
    setSpotPhoto: (spotPhoto: File | string | null) => set({ spotPhoto }),
    setSpotPhoto1: (spotPhoto1: File | string | null) => set({ spotPhoto1 }),
    setSpotPhoto2: (spotPhoto2: File | string | null) => set({ spotPhoto2 }),
    setSpotPhoto3: (spotPhoto3: File | string | null) => set({ spotPhoto3 }),
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
      spotPhoto: null,
      spotPhoto1: null,
      spotPhoto2: null,
      spotPhoto3: null,
      hashtags: []
    })
  }))
);