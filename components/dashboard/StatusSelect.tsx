'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { leadStatuses } from '@/content/dashboard';
import { statusTone } from '@/lib/leadStatus';

export default function StatusSelect({ id, value }: { id: string; value: string }) {
  const [current, setCurrent] = useState(value);
  const [failed, setFailed] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function update(next: string) {
    const previous = current;
    setCurrent(next);
    setFailed(false);

    const supabase = createClient();
    const { error } = await supabase.from('leads').update({ status: next }).eq('id', id);

    if (error) {
      setCurrent(previous);
      setFailed(true);
      return;
    }
    startTransition(() => router.refresh());
  }

  return (
    <span className="inline-flex flex-col gap-1">
      <select
        aria-label="حالة المتابعة"
        value={current}
        disabled={pending}
        onChange={(e) => update(e.target.value)}
        className={`focus-ring cursor-pointer rounded-full border-0 px-3.5 py-1.5 font-heading text-xs transition-colors ${statusTone(current)}`}
      >
        {leadStatuses.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      {failed ? <span className="text-[0.68rem] text-pink-deep">لم يُحفَظ — أعد المحاولة</span> : null}
    </span>
  );
}
