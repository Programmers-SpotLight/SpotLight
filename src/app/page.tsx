import BannerSection from "@/components/main/BannerSection";
import PopularSection from "@/components/main/PopularSection";
import RecommendationSection from "@/components/main/RecommendationSection";
import InterestingSection from "@/components/main/InterestingSection";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fetchHandler } from "@/http/http";
import { Suspense } from "react";
import SearchLoading from "@/components/search/search-contents/SearchLoading";

export default async function Home() {
  try {
    const popularSelections = await fetchHandler("api/selections/popular", 600);
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
  } catch (error) {
    return <div>오류가 발생했습니다. 다시 시도해 주세요.</div>;
  }
}
