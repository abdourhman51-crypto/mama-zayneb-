-- السماح لأفراد الطاقم (public.staff عبر is_staff()) بحذف تسجيل من صفحة الإدارة.
-- ملاحظة: is_staff() وجدول public.staff أُنشئا في migration سابقة
-- (staff_allowlist_and_lead_policies) طُبِّقت مباشرة على قاعدة الإنتاج
-- ولم تُحفَظ كملفّ في هذا المستودع — راجع README.md § "منصّة الإدارة".

drop policy if exists "leads_staff_delete" on public.leads;
create policy "leads_staff_delete"
  on public.leads
  for delete
  to authenticated
  using (is_staff());
