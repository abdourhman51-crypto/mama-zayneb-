'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { leadsPage } from '@/content/dashboard';

export default function DeleteLeadButton({
  id,
  name,
  className = '',
}: {
  id: string;
  name: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function remove() {
    if (pending) return;
    if (!window.confirm(leadsPage.delete.confirm(name))) return;

    setFailed(false);
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.from('leads').delete().eq('id', id);

      if (error) {
        setFailed(true);
        return;
      }
      router.refresh();
    });
  }

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        aria-label={`${leadsPage.delete.label} — ${name}`}
        disabled={pending}
        onClick={remove}
        className={`focus-ring tap-feedback grid h-9 w-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-pink/10 hover:text-pink-deep disabled:opacity-50 ${className}`}
      >
        <Trash2 className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
      </button>
      {failed ? <span className="text-[0.68rem] text-pink-deep">{leadsPage.delete.failed}</span> : null}
    </span>
  );
}
