'use client';

import AddBannerSection from "@/components/search/AddBannerSection";
import Pagination from "@/components/search/Pagination";
import SearchEngineSection from "@/components/search/SearchEngineSection";
import SearchResultSection from "@/components/search/SearchResultSection";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const SearchPage = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) { // 쿼리스트링 변경 시 동작되는 함수
      const tags = searchParams.getAll('tags');
      const catgeory = searchParams.get('카테고리') || '0';
      const region = searchParams.get("지역") || '0';

      console.log(tags, catgeory, region);
    }
  }, [searchParams]);

  return (
    <main className="w-[1086px] bg-grey0 border border-solid border-grey2 m-auto pt-10 flex flex-col gap-10 box-border h-auto">
      <AddBannerSection />
      <SearchEngineSection />
      <SearchResultSection />
      <Pagination />
    </main>
  );
};

export default SearchPage;
