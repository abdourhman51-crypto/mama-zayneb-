-- ─────────────────────────────────────────────────────────────
--  جدول التسجيلات (leads) لروضة ماما زينب
--  الإدراج يتم حصراً من مسار API في الخادم عبر service_role.
-- ─────────────────────────────────────────────────────────────

create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  parent_name   text not null check (char_length(trim(parent_name)) between 2 and 120),
  phone         text not null check (phone ~ '^0[1-9][0-9]{7,8}$'),
  child_age     text not null check (char_length(child_age) <= 60),
  desired_start text not null check (char_length(desired_start) <= 60),
  note          text check (char_length(note) <= 1000),
  utm_source    text check (char_length(utm_source) <= 160),
  utm_campaign  text check (char_length(utm_campaign) <= 160),
  status        text not null default 'new'
                check (status in ('new', 'contacted', 'visited', 'enrolled', 'lost'))
);

comment on table public.leads is 'طلبات المكالمة الواردة من صفحة الهبوط';
comment on column public.leads.status is 'حالة المتابعة: new | contacted | visited | enrolled | lost';

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

-- ── تفعيل RLS ────────────────────────────────────────────────
alter table public.leads enable row level security;

-- إدراج عام مسموح (anon + authenticated).
-- ملاحظة: التطبيق لا يستعمل هذه السياسة — الإدراج يمرّ عبر service_role
-- من الخادم، وهو يتجاوز RLS. السياسة موجودة كما هو مطلوب في المواصفات.
drop policy if exists "leads_public_insert" on public.leads;
create policy "leads_public_insert"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- القراءة للمصادَقين فقط.
drop policy if exists "leads_authenticated_select" on public.leads;
create policy "leads_authenticated_select"
  on public.leads
  for select
  to authenticated
  using (true);

-- التعديل (تغيير الحالة) للمصادَقين فقط.
drop policy if exists "leads_authenticated_update" on public.leads;
create policy "leads_authenticated_update"
  on public.leads
  for update
  to authenticated
  using (true)
  with check (true);

-- لا سياسة حذف: الحذف ممنوع على anon و authenticated.
