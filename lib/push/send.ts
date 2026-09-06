import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL } from '@/lib/supabase/config';
import { VAPID_PUBLIC_KEY, VAPID_SUBJECT } from './config';

type Payload = { title: string; body: string; url?: string; tag?: string };

/**
 * يرسل إشعاراً فورياً لكل أجهزة الموظّفين.
 * يحتاج مفتاحين على الخادم: VAPID_PRIVATE_KEY وSUPABASE_SERVICE_ROLE_KEY
 * (قراءة الاشتراكات تتجاوز RLS). بدونهما تُتخطّى الإشعارات بصمت
 * ولا يتعطّل تسجيل الولي إطلاقاً.
 */
export async function sendPushToStaff(payload: Payload): Promise<void> {
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!privateKey || !serviceKey) {
    console.warn('push skipped: VAPID_PRIVATE_KEY or SUPABASE_SERVICE_ROLE_KEY is missing');
    return;
  }

  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, privateKey);

  const admin = createClient(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await admin
    .from('push_subscriptions')
    .select('id, endpoint, p256dh, auth');

  if (error || !data?.length) return;

  const body = JSON.stringify(payload);

  const results = await Promise.allSettled(
    data.map((row) =>
      webpush.sendNotification(
        { endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } },
        body,
      ),
    ),
  );

  // اشتراك منتهٍ (404/410) يُحذف حتى لا نحاول مراسلته مجدداً
  const stale = results
    .map((r, i) =>
      r.status === 'rejected' && [404, 410].includes((r.reason as { statusCode?: number })?.statusCode ?? 0)
        ? data[i].id
        : null,
    )
    .filter((id): id is string => Boolean(id));

  if (stale.length) await admin.from('push_subscriptions').delete().in('id', stale);
}
