import { Suspense } from 'react';
import { CalendarDays, Inbox, PhoneCall, Sparkles, TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { leadsPage } from '@/content/dashboard';
import { statusLabel, statusTone } from '@/lib/leadStatus';
import StatusSelect from '@/components/dashboard/StatusSelect';
import LeadsToolbar from '@/components/dashboard/LeadsToolbar';
import PushCard from '@/components/dashboard/PushCard';
import LiveLeads from '@/components/dashboard/LiveLeads';

export const dynamic = 'force-dynamic';

type Lead = {
  id: string;
  created_at: string;
  parent_name: string;
  phone: string;
  child_age: string;
  desired_start: string;
  note: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  status: string;
};

const fmtDate = new Intl.DateTimeFormat('ar-DZ', { day: '2-digit', month: '2-digit', year: '2-digit' });
const fmtTime = new Intl.DateTimeFormat('ar-DZ', { hour: '2-digit', minute: '2-digit' });

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string };
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1000);

  const leads = (data ?? []) as Lead[];
  const status = searchParams.status ?? 'all';
  const q = (searchParams.q ?? '').trim().toLowerCase();

  const shown = leads.filter((l) => {
    if (status !== 'all' && l.status !== status) return false;
    if (!q) return true;
    return (
      l.parent_name.toLowerCase().includes(q) ||
      l.phone.includes(q) ||
      (l.note ?? '').toLowerCase().includes(q)
    );
  });

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const enrolled = leads.filter((l) => l.status === 'enrolled').length;
  const stats = [
    { label: leadsPage.stats.total, value: leads.length, Icon: Inbox, tone: 'bg-blue/14 text-blue' },
    {
      label: leadsPage.stats.fresh,
      value: leads.filter((l) => l.status === 'new').length,
      Icon: PhoneCall,
      tone: 'bg-pink/12 text-pink',
    },
    {
      label: leadsPage.stats.week,
      value: leads.filter((l) => new Date(l.created_at).getTime() > weekAgo).length,
      Icon: CalendarDays,
      tone: 'bg-yellow/25 text-ink',
    },
    { label: leadsPage.stats.converted, value: enrolled, Icon: TrendingUp, tone: 'bg-green/22 text-ink' },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      {error ? (
        <p className="rounded-3xl bg-pink/10 px-6 py-5 text-sm leading-[1.9] text-pink-deep">
          تعذّر جلب التسجيلات: {error.message}
        </p>
      ) : null}

      <PushCard />
      <LiveLeads />

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map(({ label, value, Icon, tone }) => (
          <div key={label} className="rounded-3xl bg-card p-5 shadow-soft-sm sm:p-6">
            <span className={`grid h-10 w-10 place-items-center rounded-2xl ${tone}`}>
              <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <dt className="mt-4 text-xs text-ink-soft">{label}</dt>
            <dd className="mt-1 font-heading text-2xl text-ink sm:text-3xl">{value}</dd>
          </div>
        ))}
      </dl>

      <Suspense fallback={null}>
        <LeadsToolbar total={shown.length} />
      </Suspense>

      {shown.length === 0 ? (
        <div className="rounded-[28px] bg-card px-7 py-16 text-center shadow-soft-sm">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-cream text-ink/30">
            <Sparkles className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <h2 className="mt-5 font-heading text-lg text-ink">
            {leads.length === 0 ? leadsPage.empty.title : leadsPage.searchEmptyTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-[2] text-ink-soft">
            {leads.length === 0 ? leadsPage.empty.body : leadsPage.searchEmptyBody}
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-[28px] bg-card shadow-soft-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-sm">
                <thead>
                  <tr className="border-b border-ink/8 bg-cream/50 text-xs text-ink-soft">
                    {[
                      leadsPage.columns.parent,
                      leadsPage.columns.phone,
                      leadsPage.columns.childAge,
                      leadsPage.columns.start,
                      leadsPage.columns.source,
                      leadsPage.columns.created,
                      leadsPage.columns.status,
                    ].map((c) => (
                      <th key={c} scope="col" className="whitespace-nowrap px-5 py-4 text-start font-body font-normal">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shown.map((lead) => (
                    <tr key={lead.id} className="border-b border-ink/5 transition-colors last:border-0 hover:bg-cream/50">
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pink/10 font-heading text-xs text-pink-deep">
                            {lead.parent_name.trim().charAt(0)}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-heading text-ink">{lead.parent_name}</span>
                            {lead.note ? (
                              <span className="block max-w-[16rem] truncate text-xs text-ink-soft" title={lead.note}>
                                {lead.note}
                              </span>
                            ) : null}
                          </span>
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <a
                          href={`tel:${lead.phone}`}
                          dir="ltr"
                          className="focus-ring inline-flex items-center gap-1.5 rounded-lg text-ink transition-colors hover:text-pink"
                        >
                          <PhoneCall className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                          {lead.phone}
                        </a>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-ink-soft">{lead.child_age}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-ink-soft">{lead.desired_start}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-xs text-ink-soft">
                        {lead.utm_source ?? '—'}
                        {lead.utm_campaign ? <span className="block opacity-70">{lead.utm_campaign}</span> : null}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-xs text-ink-soft">
                        {fmtDate.format(new Date(lead.created_at))}
                        <span className="block opacity-70">{fmtTime.format(new Date(lead.created_at))}</span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusSelect id={lead.id} value={lead.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <ul className="space-y-3.5 lg:hidden">
            {shown.map((lead) => (
              <li key={lead.id} className="rounded-3xl bg-card p-5 shadow-soft-sm">
                <div className="flex items-start gap-3.5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-pink/10 font-heading text-sm text-pink-deep">
                    {lead.parent_name.trim().charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-heading text-base text-ink">{lead.parent_name}</h3>
                    <span className="mt-0.5 block text-xs text-ink-soft">
                      {fmtDate.format(new Date(lead.created_at))} · {fmtTime.format(new Date(lead.created_at))}
                    </span>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1.5 font-heading text-xs ${statusTone(lead.status)}`}>
                    {statusLabel(lead.status)}
                  </span>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <dt className="text-ink-soft">{leadsPage.columns.childAge}</dt>
                    <dd className="mt-0.5 text-ink">{lead.child_age}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-soft">{leadsPage.columns.start}</dt>
                    <dd className="mt-0.5 text-ink">{lead.desired_start}</dd>
                  </div>
                </dl>

                {lead.note ? (
                  <p className="mt-3.5 rounded-2xl bg-cream px-4 py-3 text-xs leading-[1.9] text-ink-soft">
                    {lead.note}
                  </p>
                ) : null}

                <div className="mt-4 flex items-center gap-3">
                  <a
                    href={`tel:${lead.phone}`}
                    dir="ltr"
                    className="focus-ring flex flex-1 items-center justify-center gap-2 rounded-2xl bg-pink px-4 py-3 font-heading text-sm text-white transition-colors hover:bg-pink-deep"
                  >
                    <PhoneCall className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    {lead.phone}
                  </a>
                  <StatusSelect id={lead.id} value={lead.status} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
