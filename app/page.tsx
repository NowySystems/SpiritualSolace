import Image from "next/image";
import Link from "next/link";

const trustStrip = [
  { label: "Consent First", icon: "♢" },
  { label: "Human Reviewed", icon: "👥" },
  { label: "Facility Controlled", icon: "▦" },
  { label: "Temporary by Design", icon: "◷" },
  { label: "Secure & Private", icon: "▣" }
];

const timeline = [
  {
    time: "8:42 AM",
    title: "Request",
    body: "A patient requests prayer before surgery.",
    icon: "✎"
  },
  {
    time: "8:45 AM",
    title: "Review",
    body: "The facility reviews the request and applies its rules.",
    icon: "☑"
  },
  {
    time: "8:48 AM",
    title: "Responder",
    body: "A trusted responder is selected.",
    icon: "○"
  },
  {
    time: "8:58 AM",
    title: "Safety",
    body: "A message is reviewed for safety and appropriateness.",
    icon: "◇"
  },
  {
    time: "9:02 AM",
    title: "Delivered",
    body: "Comfort is delivered.",
    icon: "➤"
  }
];

const helpCards = [
  {
    title: "Before Surgery",
    body: "Patients often feel anxious before surgery. A few kind words can help.",
    icon: "☤"
  },
  {
    title: "During Recovery",
    body: "Encouragement and prayer can support healing and emotional well-being.",
    icon: "♥"
  },
  {
    title: "For Families Waiting",
    body: "Loved ones can request comfort while they wait during difficult moments.",
    icon: "👥"
  },
  {
    title: "End-of-Life Care",
    body: "Spiritual support delivered with compassion, respect, and dignity.",
    icon: "🕊"
  }
];

const facilityFeatures = [
  {
    title: "Human Review",
    body: "Every message is reviewed by trained staff before delivery.",
    icon: "☑"
  },
  {
    title: "Approved Responders",
    body: "Messages come from trusted, pre-approved community responders.",
    icon: "👥"
  },
  {
    title: "One-Way Delivery",
    body: "Messages are delivered one-way. No replies. No conversations.",
    icon: "↜"
  },
  {
    title: "Facility Rules",
    body: "You control who can send, what is allowed, and how messages are delivered.",
    icon: "▦"
  },
  {
    title: "Audit & Visibility",
    body: "Track activity, reviews, and deliveries with complete transparency.",
    icon: "☷"
  },
  {
    title: "No Public Access",
    body: "Patients do not log in. All requests are handled through your facility.",
    icon: "▣"
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f3ea] text-[#102b3a]">
      <header className="absolute inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0d2b3b]/88 text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-4xl leading-none text-white">🕊</span>
            <span>
              <span className="block text-3xl font-semibold leading-none tracking-[-0.04em]">
                Spiritual<span className="text-[#9fb36b]">Solace</span>
              </span>
              <span className="mt-1 block text-xs tracking-wide text-[#d4dedc]">Compassion. Dignity. Delivered with Care.</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-white lg:flex">
            <a href="#how" className="hover:text-[#d7e7b7]">How It Works</a>
            <a href="#facilities" className="hover:text-[#d7e7b7]">For Facilities</a>
            <a href="#responders" className="hover:text-[#d7e7b7]">For Responders</a>
            <a href="#about" className="hover:text-[#d7e7b7]">About Us</a>
            <a href="#resources" className="hover:text-[#d7e7b7]">Resources</a>
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <Link href="/landing-v1" className="rounded-md border border-white/35 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Log In
            </Link>
            <Link href="/app" className="rounded-md bg-[#86a45f] px-7 py-3 text-sm font-bold text-white shadow-lg hover:bg-[#789752]">
              View Demo
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-[#0d2b3b] text-white">
          <div className="absolute inset-0">
            <Image src="/brand/spiritualsolace-hero-dove.png" alt="Soft comfort imagery" fill priority className="object-cover object-[72%_center] opacity-55 mix-blend-screen" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,31,45,0.98)_0%,rgba(8,31,45,0.9)_38%,rgba(8,31,45,0.35)_70%,rgba(8,31,45,0.82)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(255,255,255,0.18),transparent_28%)]" />
          </div>

          <div className="relative mx-auto flex min-h-[650px] max-w-7xl items-center px-6 pb-24 pt-32">
            <div className="max-w-2xl">
              <h1 className="font-serif text-5xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-6xl lg:text-7xl">
                When someone needs comfort, a few caring words <span className="italic text-[#9fb36b]">can</span> matter.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-[#e8efef]">
                SpiritualSolace helps hospitals and care facilities deliver reviewed prayers, encouragement, affirmations, and calming messages from trusted community responders.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href="/app" className="rounded-lg bg-[#86a45f] px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-[#789752]">
                  View Demo →
                </Link>
                <a href="#how" className="rounded-lg border border-white/55 bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur hover:bg-white/12">
                  ⓘ How It Works
                </a>
              </div>
            </div>
          </div>

          <div className="relative border-t border-white/10 bg-[#0b2738]/78 px-6 py-5 backdrop-blur-md">
            <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-5">
              {trustStrip.map((item) => (
                <div key={item.label} className="flex items-center justify-center gap-3 border-white/10 text-sm font-semibold text-[#dfe9e8] md:border-r last:border-r-0">
                  <span className="text-xl text-[#9fb36b]">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -bottom-1 left-0 right-0 h-14 rounded-t-[50%] bg-[#f7f3ea]" />
        </section>

        <section id="how" className="px-6 pb-14 pt-10">
          <div className="mx-auto max-w-7xl text-center">
            <h2 className="font-serif text-4xl font-semibold tracking-[-0.025em] text-[#102b3a]">How Comfort Is Delivered</h2>
            <div className="mx-auto mt-3 flex w-28 items-center justify-center gap-3 text-[#8aa15d]">
              <span className="h-px flex-1 bg-[#d5cabb]" />
              <span>❦</span>
              <span className="h-px flex-1 bg-[#d5cabb]" />
            </div>

            <div className="relative mt-12 grid gap-8 lg:grid-cols-5">
              <div className="absolute left-[10%] right-[10%] top-[5.4rem] hidden border-t border-dashed border-[#aeb498] lg:block" />
              {timeline.map((step, index) => (
                <article key={step.title} className="relative flex flex-col items-center text-center">
                  <p className="mb-4 text-sm font-semibold text-[#102b3a]">{step.time}</p>
                  <div className={`relative z-10 grid h-20 w-20 place-items-center rounded-full text-3xl text-white shadow-[0_12px_26px_rgba(16,43,58,0.16)] ${index % 2 === 0 ? "bg-[#71925a]" : "bg-[#0d2b3b]"}`}>
                    {step.icon}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[#102b3a]">{step.title}</h3>
                  <p className="mt-2 max-w-[190px] text-sm leading-6 text-[#374b52]">{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="message" className="px-6 py-8">
          <div className="mx-auto grid max-w-7xl overflow-hidden rounded-2xl border border-[#e1d9cb] bg-[#f0eadf] shadow-[0_16px_40px_rgba(16,43,58,0.08)] lg:grid-cols-[0.9fr_1.25fr_0.9fr]">
            <div className="relative min-h-[245px] bg-[#ded5c7]">
              <Image src="/brand/spiritualsolace-hero-dove.png" alt="Comfort image" fill className="object-cover object-center opacity-70 mix-blend-multiply" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(247,243,234,0.05),rgba(247,243,234,0.72))]" />
            </div>

            <div className="flex flex-col justify-center px-8 py-9 text-center lg:px-10">
              <h2 className="font-serif text-3xl font-semibold text-[#102b3a]">A Message of Comfort</h2>
              <div className="mx-auto mt-2 flex w-24 items-center justify-center gap-2 text-[#8aa15d]">
                <span className="h-px flex-1 bg-[#d5cabb]" />
                <span>❦</span>
                <span className="h-px flex-1 bg-[#d5cabb]" />
              </div>
              <p className="mt-7 font-serif text-2xl italic leading-9 text-[#273d47]">
                “We are holding you in prayer today. May you feel courage, calm, and the presence of care around you.”
              </p>
              <p className="mt-5 text-sm text-[#607077]">— First Community Prayer Team</p>
            </div>

            <div className="flex items-center px-7 py-8">
              <div className="w-full rounded-xl bg-white/45 p-6 shadow-inner">
                <h3 className="mb-5 flex items-center gap-3 text-base font-bold text-[#102b3a]"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#71925a] text-white">✓</span>Delivered with Care</h3>
                <ul className="space-y-3 text-sm text-[#263f4b]">
                  <li>✓ Reviewed for safety and appropriateness</li>
                  <li>✓ Matches patient preferences</li>
                  <li>✓ One-way delivery to protect privacy</li>
                  <li>✓ Temporary by design</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="responders" className="px-6 py-8">
          <div className="mx-auto max-w-7xl text-center">
            <h2 className="font-serif text-4xl font-semibold tracking-[-0.025em] text-[#102b3a]">Where SpiritualSolace Helps</h2>
            <div className="mx-auto mt-3 flex w-28 items-center justify-center gap-3 text-[#8aa15d]">
              <span className="h-px flex-1 bg-[#d5cabb]" />
              <span>❦</span>
              <span className="h-px flex-1 bg-[#d5cabb]" />
            </div>

            <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {helpCards.map((card) => (
                <article key={card.title} className="rounded-xl border border-[#ded7cb] bg-white p-7 shadow-[0_10px_26px_rgba(16,43,58,0.08)]">
                  <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#8fa875] text-3xl text-white shadow-inner">{card.icon}</div>
                  <h3 className="mt-6 font-serif text-xl font-semibold text-[#102b3a]">{card.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#374b52]">{card.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="facilities" className="px-6 py-8">
          <div className="mx-auto grid max-w-7xl gap-7 rounded-2xl border border-[#d8d1c3] bg-[#e8ebe1] p-8 shadow-[0_14px_38px_rgba(16,43,58,0.08)] lg:grid-cols-[0.85fr_1.8fr]">
            <div className="flex flex-col justify-between rounded-xl bg-[#eef1e8] p-6">
              <div>
                <div className="text-4xl text-[#71925a]">▦</div>
                <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-[#102b3a]">Built for<br />Care Facilities</h2>
                <p className="mt-5 text-base leading-7 text-[#5d6f67]">SpiritualSolace is designed to fit your policies, protect your patients, and support your care teams.</p>
              </div>
              <Link href="/app" className="mt-7 inline-flex w-fit rounded-md bg-[#86a45f] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-[#789752]">
                Learn More
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {facilityFeatures.map((feature) => (
                <article key={feature.title} className="flex gap-4">
                  <span className="text-3xl text-[#71925a]">{feature.icon}</span>
                  <div>
                    <h3 className="font-bold text-[#102b3a]">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#374b52]">{feature.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="px-6 py-8">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.1fr_1.1fr_1.1fr_0.9fr]">
            <article className="rounded-xl bg-[#0d2b3b] p-8 text-white shadow-[0_12px_30px_rgba(16,43,58,0.18)]">
              <div className="mb-4 text-4xl text-[#d7e7b7]">◇</div>
              <h3 className="font-serif text-2xl font-semibold">Trust. Dignity. Compassion.</h3>
              <p className="mt-4 text-sm leading-6 text-[#dce8e6]">SpiritualSolace exists to bring comfort without burden, connection without pressure, and care that respects every person’s journey.</p>
            </article>
            <article className="rounded-xl bg-[#ecefe5] p-8">
              <div className="mb-4 text-4xl text-[#71925a]">▣</div>
              <h3 className="font-bold text-[#102b3a]">Privacy-Aware</h3>
              <p className="mt-3 text-sm leading-6 text-[#374b52]">Built with privacy and security in mind.</p>
            </article>
            <article className="rounded-xl bg-[#ecefe5] p-8">
              <div className="mb-4 text-4xl text-[#71925a]">♡</div>
              <h3 className="font-bold text-[#102b3a]">Faith-Inclusive</h3>
              <p className="mt-3 text-sm leading-6 text-[#374b52]">Respecting all beliefs and traditions.</p>
            </article>
            <article className="rounded-xl bg-white p-8 text-center shadow-[0_10px_26px_rgba(16,43,58,0.08)]">
              <h3 className="font-serif text-2xl font-semibold text-[#102b3a]">See It In Action</h3>
              <p className="mt-3 text-sm leading-6 text-[#374b52]">Explore the dashboard and see how SpiritualSolace supports care teams.</p>
              <Link href="/app" className="mt-6 inline-flex rounded-md bg-[#86a45f] px-7 py-3 text-sm font-bold text-white hover:bg-[#789752]">
                View Demo →
              </Link>
            </article>
          </div>
        </section>
      </main>

      <footer id="resources" className="mt-8 bg-[#0d2b3b] px-6 py-10 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🕊</span>
            <span className="text-2xl font-semibold">Spiritual<span className="text-[#9fb36b]">Solace</span></span>
          </div>
          <div><h4 className="text-xs font-bold uppercase tracking-widest text-[#9fb36b]">Product</h4><p className="mt-3 text-sm text-[#dce8e6]">How It Works<br />Features<br />Security</p></div>
          <div><h4 className="text-xs font-bold uppercase tracking-widest text-[#9fb36b]">Resources</h4><p className="mt-3 text-sm text-[#dce8e6]">Blog<br />Help Center<br />Privacy Policy</p></div>
          <div><h4 className="text-xs font-bold uppercase tracking-widest text-[#9fb36b]">Company</h4><p className="mt-3 text-sm text-[#dce8e6]">About Us<br />Contact<br />Careers</p></div>
          <div><p className="text-sm text-[#dce8e6]">© 2026 SpiritualSolace. Demo prototype.</p></div>
        </div>
      </footer>
    </div>
  );
}
