import BannerSection from "@/components/main/BannerSection";
import PopularSection from "@/components/main/PopularSection";
import RecommendationSection from "@/components/main/RecommendationSection";
import InterestingSection from "@/components/main/InterestingSection";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fetchHandler } from "@/http/http";

export default async function Home() {
  try {
  const popularSelections = await fetchHandler('api/selections/popular');
  return (
    <main className="w-[1086px] bg-grey0 border border-solid border-grey2 m-auto pt-10 flex flex-col gap-10 box-border h-auto">
      <BannerSection />
      <RecommendationSection />
      <PopularSection selections={popularSelections} />
      <InterestingSection />
    </main>
  );
} catch (error) {
  // Todo : 서버사이드 데이터 페칭 간 에러 발생 처리

}
}
