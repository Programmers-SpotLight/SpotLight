import { IModalCreateSelectionSpotExtraData } from "@/models/selection.model";
import { useModalStore } from "@/stores/modalStore";
import { useStore } from "zustand";
import useModalExtraData from "./useModalExtraData";
import { toast } from "react-toastify";

const useOpenSelectionSpotAddModal = () => {
  const { openModal } = useStore(useModalStore);
  const { setExtraData } =
    useModalExtraData<IModalCreateSelectionSpotExtraData>();

  const openSpotAddModal = (spotCategories: { id: number; name: string }[]) => {
    if (spotCategories.length === 0) {
      toast.error("스팟 카테고리가 없습니다. 다시 시도해주세요.");
      return;
    }

    setExtraData({
      spotCategories
    });
    openModal("GoogleMapsAddSelectionSpot");
  };

  return openSpotAddModal;
};

export default useOpenSelectionSpotAddModal;
