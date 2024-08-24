'use client';

import React from "react";
import Button from "../../button/Button";
import { useModalStore } from "@/stores/modalStore";
import { useSearchParams } from "next/navigation";
import { QUERY_STRING_DEFAULT, QUERY_STRING_NAME } from "@/constants/queryString.constants";
import { TuserSelection } from "@/models/user.model";
import useDeleteSelection from "@/hooks/mutations/useDeleteSelection";

interface ModalSelectionDeletePrpse {
  title: string;
  selectionId: number;
}

const ModalSelectionDelete = ({
  title,
  selectionId
}: ModalSelectionDeletePrpse) => {
  const {handleDeleteSelection} = useDeleteSelection()
  const {closeModal} = useModalStore();
  const searchParams = useSearchParams();
  const selectionType =(searchParams.get(QUERY_STRING_NAME.userSelection) as TuserSelection) ||(QUERY_STRING_DEFAULT.userSelection as TuserSelection);
  const handleDelete = (selectionId : number) => {
    if(selectionType) handleDeleteSelection({selectionId, selectionType})
    closeModal();
  }

  return (
    <div className="flex justify-center items-center flex-col">
      <h1 className="font-bold text-medium text-center mt-5">
      &quot;{title}&quot; <br />
        셀렉션을 정말로 삭제하시겠습니까?
      </h1>
      <h2 className="text-center font-medium text-small text-grey4 my-5">
        삭제후에는 해당 컬렉션의 모든 정보가 <br />영구적으로 제거되며 되돌릴 수
        없습니다
      </h2>
      <div className="m-auto flex gap-[10px]">
      <Button size="small" color="white" onClick={closeModal}>취소</Button>
      <Button size="small" color="danger" onClick={() => handleDelete(selectionId)}>삭제</Button>
      </div>
    </div>
  );
};

export default ModalSelectionDelete;
``