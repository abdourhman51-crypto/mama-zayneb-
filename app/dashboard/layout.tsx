import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Shell from '@/components/dashboard/Shell';
import { STAFF_LOGIN_DOMAIN } from '@/lib/staffAuth';

export const metadata = {
  title: 'منصّة ماما زينب',
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: staff } = await supabase
    .from('staff')
    .select('full_name, role, phone')
    .eq('user_id', user.id)
    .maybeSingle();

  // من ليس في جدول الموظّفين لا يرى شيئاً، حتى لو كان مسجّلاً في Auth
  if (!staff) {
    return (
      <main className="grid min-h-[100svh] place-items-center bg-cream px-6 text-center">
        <div className="max-w-sm">
          <h1 className="font-heading text-xl text-ink">لا تملك صلاحية الدخول</h1>
          <p className="mt-3 text-sm leading-[2] text-ink-soft">
            حسابك ليس مضافاً إلى فريق الروضة. تواصل مع مسؤول المنصّة لإضافتك.
          </p>
        </div>
      </main>
    );
  }

  const fallbackPhone = (user.email ?? '').replace(`@${STAFF_LOGIN_DOMAIN}`, '');

  return (
    <Shell
      staffName={staff.full_name ?? 'عضو الفريق'}
      staffPhone={staff.phone ?? fallbackPhone}
      role={staff.role ?? 'admin'}
    >
      {children}
    </Shell>
  );
}
