'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Radio } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { push as copy } from '@/content/dashboard';

/**
 * يشترك في بثّ Supabase لجدول التسجيلات.
 * عند وصول صفّ جديد: تُحدَّث القائمة فوراً، ويظهر إشعار داخل النظام
 * إن كان الإذن ممنوحاً والصفحة مفتوحة.
 */
export default function LiveLeads() {
  const router = useRouter();
  const [live, setLive] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('leads-stream')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'leads' },
        (message) => {
          router.refresh();

          const name = (message.new as { parent_name?: string })?.parent_name;
          if (typeof Notification !== 'undefined' && Notification.permission === 'granted' && name) {
            new Notification(copy.newLeadTitle, {
              body: copy.newLeadBody(name),
              icon: '/images/logo.png',
              tag: 'new-lead-live',
              dir: 'rtl',
              lang: 'ar',
            });
          }
        },
      )
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'leads' }, () =>
        router.refresh(),
      )
      .subscribe((status) => setLive(status === 'SUBSCRIBED'));

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  if (!live) return null;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-green/15 px-3 py-1.5 text-[0.68rem] text-ink-soft">
      <Radio className="h-3 w-3 animate-pulse text-green" strokeWidth={2.2} aria-hidden="true" />
      {copy.liveBadge}
    </span>
  );
}
