import { lockedPage, statusLabels, type DashboardModule } from '@/content/dashboard';

/** بطاقة معاينة صمّاء — توحي بشكل الوحدة دون ادّعاء بيانات. */
function Preview() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-ink/8 bg-card p-6 sm:p-8" aria-hidden="true">
      <div className="space-y-5 opacity-45 blur-[2px]">
        <div className="grid grid-cols-3 gap-4">
          {['bg-pink/20', 'bg-blue/25', 'bg-green/25'].map((tone, i) => (
            <div key={i} className={`rounded-2xl ${tone} px-4 py-5`}>
              <div className="h-2 w-12 rounded-full bg-ink/15" />
              <div className="mt-3 h-5 w-14 rounded-full bg-ink/20" />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {[92, 76, 84, 64].map((w, i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl bg-cream px-4 py-4">
              <div className="h-8 w-8 shrink-0 rounded-full bg-ink/10" />
              <div className="h-2.5 rounded-full bg-ink/12" style={{ width: `${w}%` }} />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-card/10" />
    </div>
  );
}

export default function LockedModule({ module: m }: { module: DashboardModule }) {
  return (
    <div className="mx-auto max-w-4xl">
      <header>
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="rounded-full bg-yellow/25 px-3.5 py-1.5 font-heading text-xs text-ink">
            {lockedPage.badge}
          </span>
          <span className="rounded-full bg-ink/5 px-3.5 py-1.5 font-heading text-xs text-ink-soft">
            {m.phase} · {statusLabels[m.status]}
          </span>
        </div>

        <h1 className="mt-6 font-heading text-2xl leading-[1.45] text-ink sm:text-3xl sm:leading-[1.4]">
          {m.label}
        </h1>
        <p className="mt-3 font-heading text-lg leading-[1.8] text-ink-soft sm:text-xl">{m.promise}</p>
      </header>

      <section className="mt-10">
        <h2 className="font-heading text-base text-ink sm:text-lg">{lockedPage.whatYouGet}</h2>
        <ul className="mt-5 space-y-3">
          {m.bullets.map((b) => (
            <li
              key={b}
              className="flex gap-4 rounded-3xl bg-card px-6 py-5 text-[0.95rem] leading-[1.95] text-ink-soft shadow-soft-sm"
            >
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pink/60" aria-hidden="true" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <Preview />
      </section>

      <section className="mt-10 rounded-[32px] bg-green/[0.12] px-7 py-8 sm:px-9 sm:py-10">
        <h2 className="font-heading text-base text-ink sm:text-lg">{lockedPage.foundationTitle}</h2>
        <p className="mt-3 text-[0.95rem] leading-[2.05] text-ink-soft sm:text-base">
          {lockedPage.foundationBody}
        </p>
      </section>

      <p className="mt-10 border-r-2 border-pink/40 pr-5 font-heading text-lg leading-[1.9] text-ink sm:text-xl sm:leading-[1.85]">
        {m.hook}
      </p>

      <p className="mt-8 text-sm leading-[1.9] text-ink-soft">{lockedPage.ctaNote}</p>
    </div>
  );
}
