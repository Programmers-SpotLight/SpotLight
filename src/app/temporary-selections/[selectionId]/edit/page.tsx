'use client';

import SelectionCreateForm from "@/components/selection-create/SelectionCreateForm";
import SelectionCreateFormLoadingSpinner from "@/components/selection-create/SelectionCreateFormLoadingSpinner";
import useFetchSelectionDetailForEdit from "@/hooks/useFetchSelectionTemporaryDetailForEdit";


const editTemporarySelectionPage = ({ params }: { params: { selectionId: string } }) => {
  const {
    loading,
    error,
  } = useFetchSelectionDetailForEdit(
    Number(params.selectionId),
    true
  );

  return (
    <div className="grow flex flex-col w-[1086px] m-auto py-16 px-14 bg-grey0 border-[1px] border-solid border-grey2">
      <h1 className="text-[32px] font-extrabold">미리저장 셀렉션 수정</h1>
      <hr className="mt-10 border border-solid border-grey2"/>
      {loading && (
        <div className="flex flex-col justify-center items-center grow">
          <SelectionCreateFormLoadingSpinner />
        </div>
      )}
      {/* 에러가 발생했을 떄 */}
      {(!loading && error) && <p>Error: {error}</p>}
      {(!loading && !error) && (
        <SelectionCreateForm />
      )} 
    </div>
  );
}

export default editTemporarySelectionPage;