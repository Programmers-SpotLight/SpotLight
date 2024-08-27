import React, { useRef, useState } from "react";
import useClickOutside from "./useClickOutside";
import { TselectionStatus } from "@/models/searchResult.model";
import { useModalStore } from "@/stores/modalStore";
import { toast } from "react-toastify";
import useUpdateUserSelectionPrivate from "./mutations/useUpdateUserSelectionPrivate";
import { CARD_MENU } from "@/constants/selection.constants";
import { useRouter } from "next/navigation";
import { QUERY_KEY } from "@/constants/queryKey.constants";

const useHandleCardMenu = (status: TselectionStatus, userId: number) => {
  const [showMenu, setShowMenu] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<TselectionStatus>(status);
  const { selectionPrivate, queryClient } = useUpdateUserSelectionPrivate(userId);
  const { openModal } = useModalStore();
  const router = useRouter();


  const selectionMenuRef = useRef<HTMLUListElement>(null);
  useClickOutside(selectionMenuRef, () => setShowMenu(false));
  const handleIconClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  const handleMenuItemClick = (
    e: React.MouseEvent,
    action: string,
    selectionId: number,
    title: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (action === CARD_MENU.prviate) {
      const prvStatus = currentStatus;
      const updateStatus = currentStatus === "private" ? "public" : "private";
      selectionPrivate(selectionId, {
        onSuccess: () => {
          toast.success(
            currentStatus === "private"
              ? "비공개 설정을 해제하였습니다"
              : "비공개 설정하였습니다"
          );
          queryClient.invalidateQueries({queryKey : [QUERY_KEY.SELECTION], exact : false})
          setCurrentStatus(updateStatus);
        },
        onError: () => {
          toast.error("오류가 발생하였습니다"); 
          setCurrentStatus(prvStatus);
        }
      });
    } else if (action === CARD_MENU.delete) {
      openModal("selection-delete", { title, selectionId });
    } else if (action === CARD_MENU.modify) {
      router.push(`/selection/${selectionId}/edit`);
    }
  };

  return {
    showMenu,
    setShowMenu,
    handleIconClick,
    handleMenuItemClick,
    selectionMenuRef,
    currentStatus
  };
};

export default useHandleCardMenu;
