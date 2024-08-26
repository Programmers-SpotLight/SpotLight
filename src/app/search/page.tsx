import PageError from "@/components/common/PageError";
import PageLoading from "@/components/common/PageLoading";
import SearchBannerSection from "@/components/search/SearchBannerSection";
import SearchEngineSection from "@/components/search/SearchEngineSection";
import SearchResultSection from "@/components/search/SearchResultSection";
import { fetchHandler } from "@/http/http";
import React, { Suspense } from "react";

export const dynamic = "force-dynamic";

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
      <Suspense fallback={<PageLoading />}>
        <main className="w-[1086px] bg-grey0 border border-solid border-grey2 m-auto pt-10 flex flex-col gap-10 box-border h-auto pb-30">
          <SearchBannerSection />
          <SearchEngineSection
            selectionCategories={selectionCategories}
            regionCategories={regionCategories}
          />
          <SearchResultSection />
        </main>
      </Suspense>
    );
  } catch (error) {
    console.log(error)
    return <PageError/>
  }
};

export default SearchPage;
