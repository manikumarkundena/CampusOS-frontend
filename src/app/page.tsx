import { HeroSection } from "@/components/home/HeroSection";
import { PlatformFeatures } from "@/components/home/PlatformFeatures";
import { CampusWorkflows } from "@/components/home/CampusWorkflows";
import { ProductPreviewShowcase } from "@/components/home/ProductPreviewShowcase";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { CommunitiesPreview } from "@/components/home/CommunitiesPreview";
import { CampusVoicePreview } from "@/components/home/CampusVoicePreview";
import { CertificateTrustSection } from "@/components/home/CertificateTrustSection";
import { CtaSection } from "@/components/home/CtaSection";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Section A: Hero with 3D Perspective Grid & Layered Atmospheric Lighting */}
      <HeroSection />

      {/* Section B: Platform Capabilities (4 Coordinated Layered Cards) */}
      <PlatformFeatures />

      {/* Section C: How CampusOS Works (3-Step Student Sequence) */}
      <CampusWorkflows />

      {/* Section D: Product Experience Preview (Interactive Interface Showcase) */}
      <ProductPreviewShowcase />

      {/* Dynamic Campus Discovery Feeds (Connected to Real API) */}
      <FeaturedEvents />
      <CommunitiesPreview />
      <CampusVoicePreview />

      {/* Trust & Credential Verification Portal */}
      <CertificateTrustSection />

      {/* Section E: Final Call to Action (Deep Navy/Indigo Elevated Surface) */}
      <CtaSection />
    </div>
  );
}
