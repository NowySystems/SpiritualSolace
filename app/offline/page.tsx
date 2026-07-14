export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#edf4f0] px-6 py-12 text-[#0d2b3b]">
      <section className="w-full max-w-xl rounded-[2rem] border border-[#d9dfd7] bg-white p-8 text-center shadow-xl shadow-[#0d2b3b]/10">
        <div className="mx-auto flex h-20 w-28 items-center justify-center rounded-3xl border border-[#d9dfd7] bg-white p-3 shadow-sm">
          <img src="/brand/churchwork-corner-logo.png" alt="ChurchWork logo" className="h-full w-full object-contain" />
        </div>
        <p className="mt-7 text-xs font-black uppercase tracking-[0.2em] text-[#506a49]">ChurchWork offline</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.05em] text-[#0d2b3b]">You are offline.</h1>
        <p className="mt-4 text-sm leading-7 text-[#4f6259]">
          ChurchWork needs a secure connection for live pilot data, request updates, and partner coordination. Reconnect to continue.
        </p>
        <a
          href="/pilot"
          className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-[#0f3f35] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#0f3f35]/18 transition hover:bg-[#082838]"
        >
          Return to Pilot
        </a>
      </section>
    </main>
  );
}
