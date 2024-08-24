'use client';

/*
    This page is used to edit a selection. 
    It is accessed by clicking on the edit button on the selection page.

    - The page shouldn't be accessible if the user is not logged in.
    - The page shouldn't be accessible if the user is not the owner of the selection.
    - The page shouldn't be accessible if the selection has one or more reviews.
    - The page should display the selection details, in the same format as the one for creating a selection.
    - The page should allow the user to edit the selection details.
    - The page should allow the user to save the changes.
*/

import SelectionCreateForm from "@/components/selection-create/SelectionCreateForm";
import SelectionCreateFormLoadingSpinner from "@/components/selection-create/SelectionCreateFormLoadingSpinner";
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

  return (
    <div className="grow flex flex-col w-[1086px] m-auto py-16 px-14 bg-grey0 border-[1px] border-solid border-grey2">
      <h1 className="text-[32px] font-extrabold">셀렉션 수정</h1>
      <hr className="mt-10 border border-solid border-grey2"/>
      {loading && (
        <div className="flex flex-col justify-center items-center grow">
          <SelectionCreateFormLoadingSpinner />
        </div>
      )}
      {(!loading && error) && <p>Error: {error}</p>}
      {(!loading && !error) && (
        <SelectionCreateForm />
      )} 
    </div>
  );
}

export default EditSelectionPage;