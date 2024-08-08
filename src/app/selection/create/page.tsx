'use client';

import SelectionCreateForm from "@/components/selection-create/SelectionCreateForm";
import { useSearchParams } from "next/navigation";

export const dynamic = 'force-dynamic';


const SelectionCreatePage = () => {
  const params = useSearchParams();

  return (
    <div className="grow flex flex-col">
      <div className="w-full lg:w-3/4 mx-auto py-16 px-8 bg-grey0 border-[1px] border-solid border-grey2 grow flex flex-col">
        <h1 className="text-[32px] font-bold border">셀렉션 생성</h1>
        <hr className="mt-8 border-[2px] w-[90%]"/>
        <SelectionCreateForm />
      </div>
    </div>
  );
};

export default SelectionCreatePage;