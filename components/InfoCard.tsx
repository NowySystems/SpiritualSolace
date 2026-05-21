import Link from "next/link";

export function InfoCard({ title, metric, detail, href }: { title: string; metric: string; detail: string; href?: string }) {
  const content = (
    <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-panel">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-crcf-blue">{title}</p>
      <p className="mt-4 text-2xl font-bold text-crcf-navy">{metric}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{detail}</p>
    </div>
  );

  if (!href) return content;
  return <Link href={href}>{content}</Link>;
}
