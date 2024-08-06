import BannerSection from "@/components/main/BannerSection";
import PopularSection from "@/components/main/PopularSection";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RecommendationSection from "@/components/main/RecommendationSection";
import InterestingSection from "@/components/main/InterestingSection";

export default function Home() {
  console.log(process.env.DB_HOST)
  return (
    <main className="w-[1086px] bg-grey0 border border-solid border-grey2 m-auto pt-10 flex flex-col gap-10 box-border h-auto">
      <BannerSection />
      <RecommendationSection />
      <PopularSection />
      <InterestingSection />
    </main>
  );
}
