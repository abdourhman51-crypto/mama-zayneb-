import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { normalizeDzPhone } from '@/lib/phone';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Body = {
  parent_name?: string;
  phone?: string;
  child_age?: string;
  desired_start?: string;
  note?: string | null;
  website?: string;
  utm_source?: string | null;
  utm_campaign?: string | null;
};

const MAX = { name: 120, age: 60, start: 60, note: 1000, utm: 160 };

const clip = (v: unknown, max: number) =>
  typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null;

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  // حقل الـhoneypot: إن كان ممتلئاً فهو روبوت — نردّ بنجاح صامت دون تسجيل.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const parentName = clip(body.parent_name, MAX.name);
  const phone = typeof body.phone === 'string' ? normalizeDzPhone(body.phone) : null;
  const childAge = clip(body.child_age, MAX.age);
  const desiredStart = clip(body.desired_start, MAX.start);

  if (!parentName || parentName.length < 2 || !phone || !childAge || !desiredStart) {
    return NextResponse.json({ error: 'validation_failed' }, { status: 422 });
  }

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error('Supabase env vars are missing');
    return NextResponse.json({ error: 'server_misconfigured' }, { status: 500 });
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.from('leads').insert({
    parent_name: parentName,
    phone,
    child_age: childAge,
    desired_start: desiredStart,
    note: clip(body.note, MAX.note),
    utm_source: clip(body.utm_source, MAX.utm),
    utm_campaign: clip(body.utm_campaign, MAX.utm),
  });

  if (error) {
    console.error('Supabase insert failed:', error.message);
    return NextResponse.json({ error: 'insert_failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
