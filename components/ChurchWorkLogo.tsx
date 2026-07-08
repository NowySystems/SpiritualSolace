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
    <img
      src="/brand/churchwork-corner-logo.png"
      alt={title}
      className={["object-contain", className].join(" ")}
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = "/brand/churchwork-corner-logo.svg";
      }}
    />
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
