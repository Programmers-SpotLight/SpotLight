import BannerSection from "@/components/main/BannerSection";
import PopularSection from "@/components/main/PopularSection";
import RecommendationSection from "@/components/main/RecommendationSection";
import InterestingSection from "@/components/main/InterestingSection";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fetchHandler } from "@/http/http";
import { Suspense } from "react";
import PageLoading from "@/components/common/PageLoading";
import PageError from "@/components/common/PageError";

export const dynamic = "force-dynamic";

export default async function Home() {
  return <PageError/>
  // try {
  //   const popularSelections = await fetchHandler("api/selections/popular", 1);
  //   return (
  //     <Suspense fallback={<PageLoading />}>
  //       <main className="w-[1086px] bg-grey0 border border-solid border-grey2 m-auto pt-10 flex flex-col gap-10 box-border h-auto">
  //         <BannerSection />
  //         <RecommendationSection />
  //         <PopularSection selections={popularSelections} />
  //         <InterestingSection />
  //       </main>
  //     </Suspense>
  //   );
  // } catch (error) {
  //   console.log(error)
  //   return <PageError/>
  // }
}
