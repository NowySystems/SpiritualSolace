type ChurchWorkMarkProps = {
  className?: string;
  heartFill?: string;
  title?: string;
};

type ChurchWorkLogoProps = {
  className?: string;
  markClassName?: string;
  tagline?: string;
  tone?: "light" | "dark";
  variant?: "lockup" | "mark";
};

export function ChurchWorkMark({ className = "h-12 w-12", heartFill = "#fffdf9", title = "ChurchWork" }: ChurchWorkMarkProps) {
  return (
    <svg viewBox="0 0 160 120" role="img" aria-label={title} className={className}>
      <path
        d="M76 16C49.5 16 28 37.5 28 64s21.5 48 48 48"
        fill="none"
        stroke="#0D2B3B"
        strokeLinecap="round"
        strokeWidth="13"
      />
      <circle cx="61" cy="43" r="10.5" fill="#0D2B3B" />
      <circle cx="96" cy="43" r="10.5" fill="#3F806E" />
      <path
        d="M44 95c-1.8-18.6 4.7-34.4 19.6-43.2 10.4 7 17.7 16.8 22.2 29.2-10.2 15.7-24.1 20.4-41.8 14Z"
        fill="#0D2B3B"
      />
      <path
        d="M78.5 81.8c5.6-13 14.1-23.1 25.5-30.2 14 9 20.2 24.6 18.2 42.9-18.7 7.5-33.2 3.2-43.7-12.7Z"
        fill="#3F806E"
      />
      <path
        d="M83 82.9c-12.7-14.8-23.7-18.4-32.3-10.6-10.2 9.3-1.6 26.7 32.3 42.1 33.9-15.4 42.5-32.8 32.3-42.1-8.6-7.8-19.6-4.2-32.3 10.6Z"
        fill={heartFill}
      />
    </svg>
  );
}

export function ChurchWorkLogo({
  className = "",
  markClassName = "h-12 w-12",
  tagline,
  tone = "dark",
  variant = "lockup"
}: ChurchWorkLogoProps) {
  const wordColor = tone === "light" ? "text-white" : "text-[#0d2b3b]";
  const taglineColor = tone === "light" ? "text-[#d4dedc]" : "text-[#3f806e]";
  const badgeClass = tone === "light" ? "border-white/35 bg-white/95" : "border-[#d8d0c0] bg-white";

  if (variant === "mark") {
    return (
      <span className={`inline-flex items-center justify-center rounded-full border ${badgeClass} p-1.5 shadow-sm ${className}`}>
        <ChurchWorkMark className={markClassName} />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span className={`inline-flex items-center justify-center rounded-full border ${badgeClass} p-1.5 shadow-sm`}>
        <ChurchWorkMark className={markClassName} />
      </span>
      <span>
        <span className={`block font-serif text-3xl font-semibold leading-none tracking-[-0.04em] ${wordColor}`}>
          Church<span className="text-[#3f806e]">Work</span>
        </span>
        {tagline ? <span className={`mt-1 block text-xs font-medium tracking-wide ${taglineColor}`}>{tagline}</span> : null}
      </span>
    </span>
  );
}
