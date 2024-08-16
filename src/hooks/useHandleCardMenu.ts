import React, { useRef, useState } from 'react'
import useClickOutside from './useClickOutside';
import { TselectionStatus } from '@/models/searchResult.model';
import useUpdateUserSelectionPrivate from './queries/useUpdateUserSelectionPrivate';

const useHandleCardMenu = (status : TselectionStatus) => {
    const [showMenu, setShowMenu] = useState(false);
    const [currentStatus, setCurrentStatus] = useState<TselectionStatus>(status)
    const {selectionPrivate} = useUpdateUserSelectionPrivate("1");

    const selectionMenuRef = useRef<HTMLUListElement>(null);
    useClickOutside(selectionMenuRef, () => setShowMenu(false));

    const handleIconClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowMenu((prev) => !prev);
      };

      const handleMenuItemClick = (e: React.MouseEvent, action: string, selectionId : number) => {
        console.log(`${action} 클릭됨!`);
        e.preventDefault();
        e.stopPropagation();
        if (action === "비공개 설정하기") {
          const prvStatus = currentStatus 
          const updateStatus = (currentStatus === "private" ? "public" : "private");
          selectionPrivate(selectionId, {
            onSuccess: () => {
              setCurrentStatus(updateStatus);
            },
            onError: () => {
              setCurrentStatus(prvStatus);
            }
          });
        }
      };

      const handleBookMarkClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("bookmark 클릭");
      };
    

      return {showMenu, setShowMenu, handleIconClick, handleMenuItemClick, selectionMenuRef, handleBookMarkClick, currentStatus}
}

export default useHandleCardMenu