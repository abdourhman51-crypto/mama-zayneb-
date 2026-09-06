'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { leadStatuses, leadsPage } from '@/content/dashboard';

export default function LeadsToolbar({ total }: { total: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const status = params.get('status') ?? 'all';
  const [term, setTerm] = useState(params.get('q') ?? '');

  // بحث مؤجَّل حتى لا نعيد التوجيه عند كل حرف
  useEffect(() => {
    const id = setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (term.trim()) next.set('q', term.trim());
      else next.delete('q');
      const qs = next.toString();
      router.replace(qs ? `/dashboard?${qs}` : '/dashboard', { scroll: false });
    }, 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  function hrefFor(value: string) {
    const next = new URLSearchParams(params.toString());
    if (value === 'all') next.delete('status');
    else next.set('status', value);
    const qs = next.toString();
    return qs ? `/dashboard?${qs}` : '/dashboard';
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder={leadsPage.search}
          aria-label={leadsPage.search}
          className="focus-ring w-full rounded-2xl border border-ink/10 bg-white py-3.5 pe-11 ps-12 font-body text-sm text-ink shadow-soft-sm transition-colors placeholder:text-ink/30 hover:border-ink/20"
        />
        <Search
          className="pointer-events-none absolute inset-y-0 start-4 my-auto h-[1.15rem] w-[1.15rem] text-ink/30"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        {term ? (
          <button
            type="button"
            onClick={() => setTerm('')}
            aria-label="مسح البحث"
            className="focus-ring tap-feedback absolute inset-y-0 end-3 my-auto grid h-7 w-7 place-items-center rounded-full text-ink/40 hover:bg-cream hover:text-ink"
          >
            <X className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        <div className="flex gap-2">
          {[{ value: 'all', label: leadsPage.filterAll }, ...leadStatuses].map((s) => (
            <a
              key={s.value}
              href={hrefFor(s.value)}
              className={`focus-ring tap-feedback whitespace-nowrap rounded-full px-4 py-2 font-heading text-xs transition-colors sm:text-sm ${
                status === s.value
                  ? 'bg-ink text-white'
                  : 'bg-white text-ink-soft shadow-soft-sm hover:text-ink'
              }`}
            >
              {s.label}
            </a>
          ))}
        </div>
        <span className="ms-auto whitespace-nowrap text-xs text-ink-soft">
          {leadsPage.count(total)}
        </span>
      </div>
    </div>
  );
}
