type ChurchWorkMarkProps = {
  className?: string;
  title?: string;
};

type ChurchWorkLogoProps = {
  className?: string;
  markClassName?: string;
  wordClassName?: string;
  taglineClassName?: string;
  tagline?: string;
  tone?: "light" | "dark";
  variant?: "lockup" | "mark";
};

export function ChurchWorkMark({ className = "h-16 w-28", title = "ChurchWork" }: ChurchWorkMarkProps) {
  return (
    <svg viewBox="0 0 260 120" role="img" aria-label={title} className={className}>
      <path
        d="M79 13C49.2 13 25 37.2 25 67s24.2 54 54 54"
        fill="none"
        stroke="#0D2B3B"
        strokeLinecap="round"
        strokeWidth="14"
      />
      <circle cx="71" cy="42" r="10.5" fill="#0D2B3B" />
      <circle cx="109" cy="42" r="10.5" fill="#3F806E" />
      <path
        d="M52 98c-2.5-20.7 5.4-36.6 22.7-45.4 11 7.5 18.7 17.3 22.7 29.6-11.5 16.5-26.7 21.8-45.4 15.8Z"
        fill="#0D2B3B"
      />
      <path
        d="M91.5 83c5.8-14 15.2-24.3 28.1-30.8 15.9 9.2 23 25.4 20.4 46.7-20.2 7.3-36.4 2-48.5-15.9Z"
        fill="#3F806E"
      />
      <path
        d="M96 84.7c-12.5-14.8-24.2-18.6-34-10.1-10.8 9.3-1.4 27.4 34 42.6 35.4-15.2 44.8-33.3 34-42.6-9.8-8.5-21.5-4.7-34 10.1Z"
        fill="#fffdf9"
      />
      <path
        d="M140 48h16l17 45 18-45h15l18 45 17-45h15l-26 64h-14l-18-43-18 43h-14L140 48Z"
        fill="#3F806E"
      />
    </svg>
  );
}

export function ChurchWorkLogo({
  className = "",
  markClassName = "h-16 w-28",
  wordClassName = "text-3xl",
  taglineClassName = "text-xs",
  tagline,
  tone = "dark",
  variant = "lockup"
}: ChurchWorkLogoProps) {
  const wordColor = tone === "light" ? "text-white" : "text-[#0d2b3b]";
  const taglineColor = tone === "light" ? "text-[#d4dedc]" : "text-[#3f806e]";
  const badgeClass = tone === "light" ? "border-white/35 bg-white/95" : "border-[#d8d0c0] bg-white";

  if (variant === "mark") {
    return (
      <span className={`inline-flex items-center justify-center rounded-2xl border ${badgeClass} p-2 shadow-sm ${className}`}>
        <ChurchWorkMark className={markClassName} />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span className={`inline-flex items-center justify-center rounded-2xl border ${badgeClass} p-2 shadow-sm`}>
        <ChurchWorkMark className={markClassName} />
      </span>
      <span>
        <span className={`block font-serif ${wordClassName} font-semibold leading-none tracking-[-0.04em] ${wordColor}`}>
          Church<span className="text-[#3f806e]">Work</span>
        </span>
        {tagline ? <span className={`mt-1 block ${taglineClassName} font-medium tracking-wide ${taglineColor}`}>{tagline}</span> : null}
      </span>
    </span>
  );
}
