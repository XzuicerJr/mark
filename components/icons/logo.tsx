import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 149 149"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-7 h-7", className)}
    >
      <rect width="149" height="149" rx="30" fill="url(#paint0_linear_40_8)" />
      <path
        d="M62.5 69.8333L75 82.3333L116.667 40.6667M112.5 74V103.167C112.5 105.377 111.622 107.496 110.059 109.059C108.496 110.622 106.377 111.5 104.167 111.5H45.8333C43.6232 111.5 41.5036 110.622 39.9408 109.059C38.378 107.496 37.5 105.377 37.5 103.167V44.8333C37.5 42.6232 38.378 40.5036 39.9408 38.9408C41.5036 37.378 43.6232 36.5 45.8333 36.5H91.6667"
        stroke="#F3F3F3"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_40_8"
          x1="0"
          y1="149"
          x2="149"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#69EE00" />
          <stop offset="1" stopColor="#008904" />
        </linearGradient>
      </defs>
    </svg>
  );
}
