import { CareBinder } from "@/components/CareBinder";

export const metadata = {
  title: "Super Synth Demo | ChurchWork",
  description: "Public-safe synthetic demo route for the ChurchWork guided care binder workflow.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ChurchWorkSuperSynthDemoPage() {
  return (
    <main className="min-h-screen bg-[#ece8df] p-3 text-[#102b3a] sm:p-5 lg:p-8">
      <section className="mx-auto mb-4 max-w-7xl rounded-[1.5rem] border border-[#d8d0c0] bg-[#fffdf9] p-5 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#789052]">
          ChurchWork synthetic demo route
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-[-0.04em] text-[#102b3a]">
          Super Synth Care Binder walkthrough
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#4d5d55]">
          No access gate, no real patient data, no external send. This route lets a synthetic user verify the guided care workflow from queue to person record, action prep, timeline, and audit-safe activity.
        </p>
      </section>
      <CareBinder autoStartDemo />
    </main>
  );
}
