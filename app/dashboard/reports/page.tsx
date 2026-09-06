import { notFound } from 'next/navigation';
import { modules } from '@/content/dashboard';
import LockedModule from '@/components/dashboard/LockedModule';

const mod = modules.find((m) => m.slug === 'reports');

export const metadata = { title: mod ? `${mod.label} — منصّة ماما زينب` : 'منصّة ماما زينب' };

export default function Page() {
  if (!mod) notFound();
  return <LockedModule module={mod} />;
}
