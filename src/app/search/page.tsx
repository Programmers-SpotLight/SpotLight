import SearchBannerSection from "@/components/search/SearchBannerSection";
import SearchEngineSection from "@/components/search/SearchEngineSection";
import SearchResultSection from "@/components/search/SearchResultSection";
import { fetchHandler } from "@/http/http";
import React from "react";

const SearchPage = async () => {
  try {
  const selectionCategories = await fetchHandler('api/selections/categories');
  const regionCategories = await fetchHandler('api/selections/locations');

  return (
    <main className="w-[1086px] bg-grey0 border border-solid border-grey2 m-auto pt-10 flex flex-col gap-10 box-border h-auto pb-30">
      <SearchBannerSection />
      <SearchEngineSection selectionCategories={selectionCategories} regionCategories={regionCategories}/>
      <SearchResultSection />
    </main>
  ); } catch (error) {
  // Todo : 서버사이드 데이터 페칭 간 에러 발생 처리
  }
};

export default SearchPage;
