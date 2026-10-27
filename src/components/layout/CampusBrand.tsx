import React from "react";
import Link from "next/link";

interface CampusBrandProps {
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
  href?: string;
}

export function CampusBrand({ size = "md", inverted = false, href = "/" }: CampusBrandProps) {
  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-11 h-11",
  };

  const textSizes = {
    sm: "text-base tracking-tight",
    md: "text-xl tracking-tight",
    lg: "text-2xl lg:text-3xl tracking-tight",
  };

  const content = (
    <div className="flex items-center gap-2.5 select-none group">
      {/* Geometric Crystalline Campus Symbol */}
      <div
        className={`relative ${iconSizes[size]} rounded-lg p-0.5 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shadow-sm ${
          inverted
            ? "bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-blue-500/20"
            : "bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 shadow-blue-500/20"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full text-white p-1"
        >
          {/* Futuristic interconnected university crest */}
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>

      {/* CampusOS Wordmark */}
      <div className="flex flex-col">
        <span
          className={`font-bold font-sans ${textSizes[size]} leading-none ${
            inverted ? "text-white" : "text-slate-900"
          }`}
        >
          Campus
          <span className="text-blue-600 font-extrabold ml-0.5 drop-shadow-sm">OS</span>
        </span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md">
        {content}
      </Link>
    );
  }

  return content;
}
