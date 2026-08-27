"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function AnnouncementBar({ messages }: { messages: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const loopText = messages.filter(Boolean).join("   •   ");

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        xPercent: -50,
        duration: 22,
        repeat: -1,
        ease: "none",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full bg-foreground text-background overflow-hidden h-9 flex items-center">
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        <span className="text-xs tracking-wide px-6">{loopText}</span>
        <span className="text-xs tracking-wide px-6" aria-hidden="true">
          {loopText}
        </span>
      </div>
    </div>
  );
}
