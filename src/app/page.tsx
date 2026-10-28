import { HeroSection } from "@/components/home/HeroSection";
import { CampusWorkflows } from "@/components/home/CampusWorkflows";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { CommunitiesPreview } from "@/components/home/CommunitiesPreview";
import { CampusVoicePreview } from "@/components/home/CampusVoicePreview";
import { CertificateTrustSection } from "@/components/home/CertificateTrustSection";
import { CtaSection } from "@/components/home/CtaSection";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <CampusWorkflows />
      <FeaturedEvents />
      <CommunitiesPreview />
      <CampusVoicePreview />
      <CertificateTrustSection />
      <CtaSection />
    </div>
  );
}
