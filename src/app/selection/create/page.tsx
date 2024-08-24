'use client';

import SelectionCreateForm from "@/components/selection-create/SelectionCreateForm";

export const dynamic = 'force-dynamic';

const SelectionCreatePage = () => {

  return (
    <div className="grow flex flex-col w-[1086px] m-auto py-16 px-14 bg-grey0 border-[1px] border-solid border-grey2">
        <h1 className="text-[32px] font-extrabold">셀렉션 생성</h1>
        <hr className="mt-10 border border-solid border-grey2"/>
        <SelectionCreateForm />
    </div>
  );
};

export default SelectionCreatePage;