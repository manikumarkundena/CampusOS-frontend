"use client";

import React, { useState, useEffect } from "react";

const ROTATING_PHRASES = [
  "Discover opportunities.",
  "Bring communities together.",
  "Manage campus activities.",
  "Verify credentials securely.",
];

export function RotatingHeadline() {
  const [index, setIndex] = useState(0);
  const [fadeState, setFadeState] = useState<"in" | "out">("in");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setFadeState("out");
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);
        setFadeState("in");
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  const currentPhrase = ROTATING_PHRASES[index];

  return (
    <div className="space-y-1 sm:space-y-2">
      {/* Hidden static full announcement for screen readers */}
      <h1 className="sr-only">
        Everything your campus needs. {currentPhrase}
      </h1>

      {/* Visual Display */}
      <div
        aria-hidden="true"
        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]"
      >
        <span className="block">Everything your campus needs.</span>
        <span className="block mt-2 min-h-[1.25em] relative">
          <span
            className={`block text-blue-600 font-bold transition-all duration-300 ease-out ${
              fadeState === "in"
                ? "opacity-100 transform-none"
                : "opacity-0 translate-y-2"
            }`}
          >
            {currentPhrase}
          </span>
        </span>
      </div>
    </div>
  );
}
