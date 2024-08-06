import AddBannerSection from "@/components/search/AddBannerSection";
import SearchEngineSection from "@/components/search/SearchEngineSection";
import SearchResultSection from "@/components/search/SearchResultSection";
import React from "react";

const SearchPage = () => {

  return (
    <main className="w-[1086px] bg-grey0 border border-solid border-grey2 m-auto pt-10 flex flex-col gap-10 box-border h-auto pb-30">
      <AddBannerSection />
      <SearchEngineSection />
      <SearchResultSection />
    </main>
  );
};

export default SearchPage;
