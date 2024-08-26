'use client';

import SelectionCreateForm from "@/components/selection-create/SelectionCreateForm";
import SelectionCreateFormLoadingSpinner from "@/components/selection-create/SelectionCreateFormLoadingSpinner";
import useErrorComponents from "@/hooks/useErrorComponents";
import useFetchSelectionDetailForEdit from "@/hooks/useFetchSelectionTemporaryDetailForEdit";

const EditSelectionPage = (
  { params }: { params: { selectionId: string } }
) => {
  const {
    loading,
    error,
  } = useFetchSelectionDetailForEdit(
    Number(params.selectionId),
    false
  );

  const errorComponent = useErrorComponents(error);
  if (error) return errorComponent;

  return (
    <div className="grow flex flex-col w-[1086px] m-auto py-16 px-14 bg-grey0 border-[1px] border-solid border-grey2">
      <h1 className="text-[32px] font-extrabold">셀렉션 수정</h1>
      <hr className="mt-10 border border-solid border-grey2"/>
      {loading && (
        <div className="flex flex-col justify-center items-center grow">
          <SelectionCreateFormLoadingSpinner />
        </div>
      )}
      {(!loading && !error) && (
        <SelectionCreateForm />
      )} 
    </div>
  );
}

export default EditSelectionPage;