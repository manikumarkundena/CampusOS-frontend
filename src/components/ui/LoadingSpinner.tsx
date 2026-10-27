import React from "react";

export function LoadingSpinner({
  size = "md",
  label = "Loading...",
}: {
  size?: "sm" | "md" | "lg";
  label?: string;
}) {
  const sizeMap = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3" role="status">
      <div
        className={`${sizeMap[size]} rounded-full border-blue-200 border-t-blue-600 animate-spin`}
      />
      {label && <p className="text-xs text-slate-500 font-medium">{label}</p>}
      <span className="sr-only">Loading</span>
    </div>
  );
}
