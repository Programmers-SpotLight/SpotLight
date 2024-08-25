'use client';

import BannerSection from "@/components/main/BannerSection";
import PopularSection from "@/components/main/PopularSection";
import RecommendationSection from "@/components/main/RecommendationSection";
import InterestingSection from "@/components/main/InterestingSection";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Suspense } from "react";
import SearchLoading from "@/components/search/search-contents/SearchLoading";
import usePopularSelections from "@/hooks/usePopularSelections";


export default function Home() {
  const {
    popularSelections,
    isLoading,
    error,
  } = usePopularSelections();

  if (isLoading) {
    return <SearchLoading />;
  }

  if (error) {
    return <div>에러가 발생했습니다. {error}</div>;
  }

  return (
    <main className="w-[1086px] bg-grey0 border border-solid border-grey2 m-auto pt-10 flex flex-col gap-10 box-border h-auto">
      <Suspense fallback={<SearchLoading />}>
        <BannerSection />
        <RecommendationSection />{" "}
        <PopularSection selections={popularSelections} />
        <InterestingSection />
      </Suspense>
    </main>
  );
}
