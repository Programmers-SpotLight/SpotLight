import BannerSection from "@/components/main/BannerSection";
import PopularSection from "@/components/main/PopularSection";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fetchHandler } from "@/http/http";
import { Suspense } from "react";
import PageLoading from "@/components/common/PageLoading";
import PageError from "@/components/common/PageError";
import RecommendationSection from "@/components/main/RecommendationSection";
import DisplaySection from "@/components/main/DisplaySection";

export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    const popularSelections = await fetchHandler("api/selections/popular", 30);
    return (
      <Suspense fallback={<PageLoading />}>
        <main className="w-[1086px] bg-grey0 border border-solid border-grey2 m-auto pt-10 flex flex-col gap-10 box-border h-auto">
          <BannerSection />
          <DisplaySection />
          <PopularSection selections={popularSelections} />
          <RecommendationSection />
        </main>
      </Suspense>
    );
  } catch (error) {
    console.log(error)
    return <PageError/>
  }
}
