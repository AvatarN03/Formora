import { MarketingHeader } from "@/components/marketing/header";
import { HeroSection } from "@/components/marketing/hero-section";
import { WorkbenchSection } from "@/components/marketing/workbench-section";
import { PrinciplesSection } from "@/components/marketing/principles-section";
import { CalloutSection } from "@/components/marketing/callout-section";
import { MarketingFooter } from "@/components/marketing/footer";

export default function Home() {
  return (
    <main data-landing className="min-h-screen bg-background font-sans text-foreground">
      <MarketingHeader />
      <HeroSection />
      <WorkbenchSection />
      <PrinciplesSection />
      <CalloutSection />
      <MarketingFooter />
    </main>
  );
}
