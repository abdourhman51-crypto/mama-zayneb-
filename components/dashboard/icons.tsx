import {
  BarChart3,
  IdCard,
  Inbox,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

/** خريطة الأيقونات — تُستدعى بالاسم المكتوب في content/dashboard.ts */
export const moduleIcons: Record<string, LucideIcon> = {
  Inbox,
  Users,
  IdCard,
  Wallet,
  BarChart3,
};

export function ModuleIcon({ name, className }: { name: string; className?: string }) {
  const Icon = moduleIcons[name] ?? Inbox;
  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />;
}
