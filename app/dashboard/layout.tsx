import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Sidebar from '@/components/dashboard/Sidebar';

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

  return (
    <div className="min-h-[100svh] bg-cream lg:flex">
      <Sidebar email={user.email ?? ''} />
      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">{children}</main>
    </div>
  );
}
