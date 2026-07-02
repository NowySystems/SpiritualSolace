type ChurchWorkDoveHeroProps = {
  className?: string;
  title?: string;
};

export function ChurchWorkDoveHero({ className = "h-full w-full", title = "ChurchWork dove hero" }: ChurchWorkDoveHeroProps) {
  return (
    <svg viewBox="0 0 620 560" role="img" aria-label={title} className={className}>
      <defs>
        <linearGradient id="doveBody" x1="92" y1="100" x2="504" y2="488" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.62" stopColor="#F2F7EC" />
          <stop offset="1" stopColor="#D7E7B7" />
        </linearGradient>
        <linearGradient id="doveWing" x1="210" y1="143" x2="464" y2="433" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A9C07C" />
          <stop offset="1" stopColor="#3F806E" />
        </linearGradient>
        <filter id="doveShadow" x="0" y="0" width="620" height="560" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="28" stdDeviation="24" floodColor="#061D2B" floodOpacity="0.22" />
        </filter>
      </defs>

      <g filter="url(#doveShadow)">
        <path
          d="M99 304c35-110 133-181 257-183 58-1 107 12 146 36-40 4-78 16-113 36 48 9 90 33 126 72-57-20-111-21-161-4 36 21 65 50 85 87-60-31-121-36-183-14-48 17-92 47-132 91 7-46 25-86 54-120-26 3-53 3-79-1Z"
          fill="url(#doveBody)"
        />
        <path
          d="M213 197c-31 55-42 114-32 177 42-43 90-72 145-87 52-14 102-12 150 5-65-72-153-104-263-95Z"
          fill="url(#doveWing)"
          opacity="0.95"
        />
        <path d="M93 304c40-13 77-13 111 2-31 14-63 16-96 6-8-2-13-5-15-8Z" fill="#F7F3EA" />
        <path d="M111 289c-26-16-49-38-70-66 44 12 83 34 118 66-16-4-32-4-48 0Z" fill="#FFFFFF" opacity="0.94" />
        <circle cx="143" cy="257" r="7" fill="#0D2B3B" />
      </g>

      <path d="M122 438c105 47 217 42 337-16" fill="none" stroke="#D7E7B7" strokeWidth="10" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}
