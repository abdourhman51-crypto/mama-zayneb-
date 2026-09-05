import { worry } from '@/content/site';
import { Dots } from './Ui';

export default function Worry() {
  return (
    <section className="mx-auto max-w-content px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <Dots className="mx-auto mb-7 justify-center" />
        <h2 className="font-heading text-[1.75rem] leading-[1.4] text-ink sm:text-4xl sm:leading-[1.3]">
          {worry.title}
        </h2>
        <div className="mt-8 space-y-5">
          {worry.paragraphs.map((p) => (
            <p key={p} className="text-base leading-[2.1] text-ink-soft sm:text-lg">
              {p}
            </p>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-xl rounded-3xl bg-white px-7 py-8 font-heading text-base leading-[2] text-ink shadow-soft sm:text-lg">
          {worry.emphasis}
        </p>
      </div>
    </section>
  );
}
