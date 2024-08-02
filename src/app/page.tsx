import BannerSection from "@/components/main/BannerSection";
import InterestingSection from "@/components/main/InterestingSection";
import PopularSection from "@/components/main/PopularSection";
import RecommendationSection from "@/components/main/RecommendationSection";

export default function Home() {
  return (
    <main
      className="w-[1086px] bg-grey0 border border-solid border-grey2 m-auto pt-10 flex flex-col gap-10 box-border"
      style={{ height: "calc(100vh - 72px)" }}
    >
      <BannerSection/>
      <InterestingSection/>
      <PopularSection/>
      <RecommendationSection/>
    </main>
  );
}
