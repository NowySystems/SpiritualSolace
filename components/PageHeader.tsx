export function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="mb-8 rounded-[2rem] bg-white p-8 shadow-panel ring-1 ring-slate-200/80">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-crcf-blue">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold text-crcf-navy md:text-5xl">{title}</h2>
      <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{description}</p>
    </section>
  );
}
