import { HeroSection } from "@/components/home/HeroSection";
import { PlatformFeatures } from "@/components/home/PlatformFeatures";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { CommunitiesPreview } from "@/components/home/CommunitiesPreview";
import { CampusVoicePreview } from "@/components/home/CampusVoicePreview";
import { CtaSection } from "@/components/home/CtaSection";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <PlatformFeatures />
      <FeaturedEvents />
      <CommunitiesPreview />
      <CampusVoicePreview />
      <CtaSection />
    </div>
  );
}
