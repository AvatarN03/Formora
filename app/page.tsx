"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { MarketingHeader } from "@/components/marketing/header";
import { HeroSection } from "@/components/marketing/hero-section";
import { WorkbenchSection } from "@/components/marketing/workbench-section";
import { PrinciplesSection } from "@/components/marketing/principles-section";
import { CalloutSection } from "@/components/marketing/callout-section";
import { MarketingFooter } from "@/components/marketing/footer";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const landingRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = gsap.context(() => {
      gsap.defaults({
        ease: "power3.out",
        overwrite: "auto",
      });

      gsap.fromTo(
        ".landing-hero-item",
        {
          y: 26,
          scale: 0.985,
          autoAlpha: 0,
        },
        {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 1.25,
          stagger: 0.22,
          clearProps: "transform,opacity,visibility",
        }
      );

      gsap.utils.toArray<HTMLElement>(".landing-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          {
            y: 24,
            scale: 0.99,
            autoAlpha: 0,
          },
          {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 1.1,
            clearProps: "transform,opacity,visibility",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          }
        );
      });
    }, landingRef);

    return () => context.revert();
  }, []);

  return (
    <main
      ref={landingRef}
      data-landing
      className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20 selection:text-foreground"
    >
      <MarketingHeader />
      <HeroSection />
      <WorkbenchSection />
      <PrinciplesSection />
      <CalloutSection />
      <MarketingFooter />
    </main>
  );
}
