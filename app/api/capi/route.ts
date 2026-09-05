import { NextResponse } from 'next/server';

/**
 * ─────────────────────────────────────────────────────────────
 *  Conversions API — بنية جاهزة، غير مفعّلة بعد.
 *
 *  عند التفعيل لاحقاً:
 *  1. أضف META_CAPI_ACCESS_TOKEN في متغيّرات البيئة على Vercel.
 *  2. أزل السطر الذي يعيد 501 أدناه.
 *  3. استدعِ هذا المسار من app/api/lead/route.ts بعد نجاح الإدراج،
 *     مع تمرير event_id نفسه المستعمل في بيكسل المتصفّح (إزالة التكرار).
 * ─────────────────────────────────────────────────────────────
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GRAPH_VERSION = 'v21.0';

export async function POST(request: Request) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    return NextResponse.json({ error: 'capi_not_configured' }, { status: 501 });
  }

  // البنية الجاهزة — تُستكمل عند التفعيل.
  const payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  const endpoint = `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${accessToken}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: [
        {
          event_name: 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_id: payload.event_id,
          event_source_url: payload.event_source_url,
          user_data: payload.user_data ?? {},
        },
      ],
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'capi_failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
