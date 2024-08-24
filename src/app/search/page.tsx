import SearchLoading from "@/components/search/search-contents/SearchLoading";
import SearchBannerSection from "@/components/search/SearchBannerSection";
import SearchEngineSection from "@/components/search/SearchEngineSection";
import SearchResultSection from "@/components/search/SearchResultSection";
import { fetchHandler } from "@/http/http";
import React, { Suspense } from "react";

const SearchPage = async () => {
  try {
    const selectionCategories = await fetchHandler(
      "api/selections/categories",
      false
    );
    const regionCategories = await fetchHandler(
      "api/selections/locations",
      false
    );

    return (
      <main className="w-[1086px] bg-grey0 border border-solid border-grey2 m-auto pt-10 flex flex-col gap-10 box-border h-auto pb-30">
        <Suspense fallback={<SearchLoading />}>
          <SearchBannerSection />
          <SearchEngineSection
            selectionCategories={selectionCategories}
            regionCategories={regionCategories}
          />
          <SearchResultSection />
        </Suspense>
      </main>
    );
  } catch (error) {
    return <div>오류가 발생했습니다. 다시 시도해 주세요.</div>;
  }
};

export default SearchPage;
