'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { push as copy } from '@/content/dashboard';

/**
 * يشترك في بثّ Supabase لجدول التسجيلات — بلا أي شارة مرئية.
 *
 * ملاحظة مهمّة كانت سبب عطل «التحديث اللحظي»: قناة الاشتراك تُصادَق
 * بجلسة المستخدم عبر postgres_changes + RLS. إن اشترك المكوّن قبل أن
 * يجهّز عميل Supabase جلسة المستخدم من الكوكيز (وهذا يحدث بشكل غير
 * متزامن عند أول تحميل)، تُفتَح القناة بصفة "مجهول" فترفضها سياسة
 * is_staff() ولا يصل أي حدث — دون أي خطأ ظاهر. الإصلاح: ننتظر
 * الجلسة صراحةً قبل الاشتراك.
 */
export default function LiveLeads() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    async function start() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled || !session) return;

      channel = supabase
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
        .subscribe();
    }

    start();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
