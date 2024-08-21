import React, { useRef, useState } from "react";
import useClickOutside from "./useClickOutside";
import { TselectionStatus } from "@/models/searchResult.model";
import { useModalStore } from "@/stores/modalStore";
import { toast } from "react-toastify";
import useUpdateUserSelectionPrivate from "./mutations/useUpdateUserSelectionPrivate";

const useHandleCardMenu = (status: TselectionStatus) => {
  const [showMenu, setShowMenu] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<TselectionStatus>(status);
  const { selectionPrivate } = useUpdateUserSelectionPrivate("1");
  const { openModal } = useModalStore();

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
    title: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (action === "비공개 설정하기") {
      const prvStatus = currentStatus;
      const updateStatus = currentStatus === "private" ? "public" : "private";
      selectionPrivate(selectionId, {
        onSuccess: () => {
          toast.success(
            currentStatus === "private"
              ? "비공개 설정을 해제하였습니다"
              : "비공개 설정하였습니다"
          ); // 스낵메세지 대체
          setCurrentStatus(updateStatus);
        },
        onError: () => {
          toast.error("오류가 발생하였습니다"); // 스낵메세지 대체
          setCurrentStatus(prvStatus);
        }
      });
    } else if (action === "삭제하기") {
      openModal("selection-delete", { title, selectionId });
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
