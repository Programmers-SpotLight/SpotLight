import { useModalStore } from "@/stores/modalStore";
import { useStore } from "zustand";


const useModalExtraData = <T>() => {
  const { 
    extraData,
    setExtraData,
  } : {
    extraData: T | null,
    setExtraData: (data: T | null) => void
  } = useStore(useModalStore);

  const setExtraDataHandler = (data: T | null) => {
    setExtraData(data);
  };

  return {
    extraData,
    setExtraData: setExtraDataHandler,
  };
};

export default useModalExtraData;