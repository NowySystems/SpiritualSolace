import Image from "next/image";
import Link from "next/link";

const publicFlow = [
  { label: "Request", detail: "Scan the facility QR or open ChurchWork, choose your facility and room, then select the spiritual support you want. No requester account or personal story is required." },
  { label: "Connect", detail: "ChurchWork alerts the facility and selected care partner at the same time. The facility stays informed without another approval step." },
  { label: "Care", detail: "The care partner accepts, plans the visit, and completes the request. ChurchWork keeps the requester updated with simple, anonymous statuses." }
];

export function LandingPageV1() {
  return (
    <div className="min-h-screen bg-[#f7f3ea] text-[#102b3a]">
      <header className="absolute inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0d2b3b]/88 text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" aria-label="ChurchWork home" className="flex items-center gap-3">
            <span className="inline-flex h-[4.6rem] w-[7.8rem] items-center justify-center rounded-2xl bg-white p-2 shadow-sm">
              <img src="/brand/churchwork-corner-logo.png" alt="ChurchWork CW logo" className="h-full w-full object-contain" />
            </span>
            <span className="hidden sm:block">
              <span className="block font-serif text-3xl font-semibold leading-none tracking-[-0.04em] text-white">
                Church<span className="text-[#3f806e]">Work</span>
              </span>
              <span className="mt-1 hidden text-xs font-medium tracking-wide text-[#d4dedc] sm:block">Spiritual-care coordination</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-semibold text-white md:flex">
            <a href="#how-it-works" className="hover:text-[#d7e7b7]">How it works</a>
            <Link href="/facility-login" className="hover:text-[#d7e7b7]">Facility Login</Link>
            <Link href="/partner-login" className="hover:text-[#d7e7b7]">Partner Login</Link>
            <Link href="/admin" className="rounded-full border border-white/20 bg-white/10 px-4 py-2 hover:bg-white/15 hover:text-[#d7e7b7]">Admin Login</Link>
          </nav>
          <Link href="/request" className="rounded-md bg-[#86a45f] px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-[#789752] md:hidden">
            Request Care
          </Link>
        </div>
      </header>

      <main>
        <section className="relative isolate min-h-[720px] overflow-hidden bg-[#0d2b3b] text-white">
          <Image
            src="/brand/churchwork-hero-dove.png"
            alt="ChurchWork hero dove"
            fill
            priority
            className="-z-30 object-cover object-[74%_center] opacity-90 md:object-[78%_center]"
          />
          <div className="absolute inset-0 -z-20 bg-[linear-gradient(103deg,rgba(8,31,45,0.98)_0%,rgba(8,31,45,0.9)_42%,rgba(8,31,45,0.35)_72%,rgba(8,31,45,0.82)_100%)]" aria-hidden="true" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_24%,rgba(255,255,255,0.18),transparent_36%),radial-gradient(circle_at_80%_12%,rgba(159,179,107,0.22),transparent_32%)]" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent to-[#f7f3ea]" aria-hidden="true" />
          <div className="relative z-10 mx-auto flex min-h-[720px] max-w-7xl items-center px-6 pb-24 pt-32">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#d7e7b7] shadow-sm backdrop-blur">
                ChurchWork pilot MVP
              </div>
              <h1 className="mt-5 font-serif text-5xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-6xl lg:text-7xl">
                The right spiritual-care request, in the right hands.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#e8efef]">
                ChurchWork connects people in care settings with trusted spiritual support through a simple, private request process.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href="/request" className="rounded-lg bg-white px-8 py-4 text-base font-bold text-[#173b2d] shadow-xl hover:bg-[#f0f5e8]">
                  Request Care
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="px-6 pb-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#789052]">How it works</p>
            <h2 className="mt-3 max-w-4xl font-serif text-4xl font-semibold tracking-[-0.03em]">A simple path from request to spiritual care.</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {publicFlow.map((step, index) => (
                <article key={step.label} className="rounded-3xl border border-[#ded6c8] bg-white/75 p-6 shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#173b2d] text-sm font-black text-white">{index + 1}</span>
                  <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-[#789052]">{step.label}</p>
                  <p className="mt-3 text-sm leading-6 text-[#4d5d55]">{step.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#d9e1df] bg-[#e9f0ef] px-6 py-12">
          <div className="mx-auto max-w-5xl">
            <p className="font-serif text-3xl font-semibold tracking-[-0.03em] text-[#102b3a]">Spiritual care without creating another patient record.</p>
            <p className="mt-3 max-w-4xl text-base leading-7 text-[#4d5d55]">ChurchWork coordinates the request—not the conversation. No medical details, open messaging, pastoral notes, or patient contact information are shared through the platform.</p>
          </div>
        </section>

        <section className="px-6 py-16 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif text-4xl font-semibold tracking-[-0.03em]">Need spiritual care?</h2>
            <p className="mt-3 text-[#4d5d55]">Request support from a trusted care partner at your facility.</p>
            <Link href="/request" className="mt-7 inline-flex rounded-lg bg-[#173b2d] px-8 py-4 font-bold text-white shadow-lg hover:bg-[#214d3d]">Request Care →</Link>
            <div className="mt-6 flex justify-center gap-5 text-sm font-bold text-[#173b2d]">
              <Link href="/facility-login" className="underline underline-offset-4">Facility Sign In</Link>
              <span aria-hidden="true">·</span>
              <Link href="/partner-login" className="underline underline-offset-4">Care Partner Sign In</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
