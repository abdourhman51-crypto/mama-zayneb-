import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Body = {
  subscription?: { endpoint?: string; keys?: { p256dh?: string; auth?: string } };
  userAgent?: string;
};

/** يحفظ اشتراك جهاز الموظّف. الكتابة تمرّ بجلسته، فتحكمها سياسات RLS. */
export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  const endpoint = body.subscription?.endpoint;
  const p256dh = body.subscription?.keys?.p256dh;
  const auth = body.subscription?.keys?.auth;

  if (!endpoint || !p256dh || !auth) {
    return NextResponse.json({ error: 'invalid_subscription' }, { status: 422 });
  }

  const { error } = await supabase.from('push_subscriptions').upsert(
    {
      user_id: user.id,
      endpoint,
      p256dh,
      auth,
      user_agent: body.userAgent?.slice(0, 300) ?? null,
    },
    { onConflict: 'endpoint' },
  );

  if (error) {
    console.error('push subscribe failed:', error.message);
    return NextResponse.json({ error: 'save_failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
