import { createClient } from '@/lib/supabase/server';
import { leadsPage, leadStatuses } from '@/content/dashboard';
import StatusSelect from '@/components/dashboard/StatusSelect';
import { statusLabel, statusTone } from '@/lib/leadStatus';

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

const fmt = new Intl.DateTimeFormat('ar-DZ', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);

  const leads = (data ?? []) as Lead[];
  const active = searchParams.status ?? 'all';
  const shown = active === 'all' ? leads : leads.filter((l) => l.status === active);

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const stats = [
    { label: leadsPage.stats.total, value: leads.length, tone: 'bg-blue/15' },
    { label: leadsPage.stats.fresh, value: leads.filter((l) => l.status === 'new').length, tone: 'bg-pink/12' },
    {
      label: leadsPage.stats.week,
      value: leads.filter((l) => new Date(l.created_at).getTime() > weekAgo).length,
      tone: 'bg-yellow/22',
    },
    { label: leadsPage.stats.converted, value: leads.filter((l) => l.status === 'enrolled').length, tone: 'bg-green/20' },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <header>
        <h1 className="font-heading text-2xl text-ink sm:text-3xl">{leadsPage.title}</h1>
        <p className="mt-2 text-sm text-ink-soft sm:text-base">{leadsPage.subtitle}</p>
      </header>

      {error ? (
        <p className="mt-8 rounded-3xl bg-pink/10 px-6 py-5 text-sm leading-[1.9] text-pink-deep">
          تعذّر جلب التسجيلات: {error.message}
        </p>
      ) : null}

      <dl className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-3xl ${s.tone} px-5 py-5 sm:px-6 sm:py-6`}>
            <dt className="text-xs text-ink-soft sm:text-sm">{s.label}</dt>
            <dd className="mt-1.5 font-heading text-2xl text-ink sm:text-3xl">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-wrap gap-2">
        {[{ value: 'all', label: leadsPage.filterAll }, ...leadStatuses].map((s) => (
          <a
            key={s.value}
            href={s.value === 'all' ? '/dashboard' : `/dashboard?status=${s.value}`}
            className={`focus-ring rounded-full px-4 py-2 font-heading text-xs transition-colors sm:text-sm ${
              active === s.value ? 'bg-ink text-white' : 'bg-white text-ink-soft hover:text-ink'
            }`}
          >
            {s.label}
          </a>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="mt-8 rounded-[32px] bg-card px-7 py-16 text-center shadow-soft-sm">
          <h2 className="font-heading text-lg text-ink">{leadsPage.empty.title}</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-[2] text-ink-soft">{leadsPage.empty.body}</p>
        </div>
      ) : (
        <>
          {/* جدول على الشاشات الكبيرة */}
          <div className="mt-8 hidden overflow-hidden rounded-[28px] bg-card shadow-soft-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-sm">
                <thead>
                  <tr className="border-b border-ink/8 text-xs text-ink-soft">
                    {[
                      leadsPage.columns.created,
                      leadsPage.columns.parent,
                      leadsPage.columns.phone,
                      leadsPage.columns.childAge,
                      leadsPage.columns.start,
                      leadsPage.columns.source,
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
                    <tr key={lead.id} className="border-b border-ink/5 last:border-0 hover:bg-cream/60">
                      <td className="whitespace-nowrap px-5 py-4 text-xs text-ink-soft">
                        {fmt.format(new Date(lead.created_at))}
                      </td>
                      <td className="px-5 py-4 font-heading text-ink">
                        {lead.parent_name}
                        {lead.note ? (
                          <span className="mt-1 block max-w-xs truncate text-xs font-normal text-ink-soft" title={lead.note}>
                            {lead.note}
                          </span>
                        ) : null}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <a href={`tel:${lead.phone}`} dir="ltr" className="focus-ring rounded text-ink hover:text-pink">
                          {lead.phone}
                        </a>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-ink-soft">{lead.child_age}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-ink-soft">{lead.desired_start}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-xs text-ink-soft">
                        {lead.utm_source ?? '—'}
                        {lead.utm_campaign ? <span className="block">{lead.utm_campaign}</span> : null}
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

          {/* بطاقات على الهاتف */}
          <ul className="mt-8 space-y-4 lg:hidden">
            {shown.map((lead) => (
              <li key={lead.id} className="rounded-3xl bg-card p-6 shadow-soft-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-base text-ink">{lead.parent_name}</h3>
                    <a href={`tel:${lead.phone}`} dir="ltr" className="focus-ring mt-1 block rounded text-sm text-pink">
                      {lead.phone}
                    </a>
                  </div>
                  <span className={`rounded-full px-3 py-1.5 font-heading text-xs ${statusTone(lead.status)}`}>
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
                  <div>
                    <dt className="text-ink-soft">{leadsPage.columns.created}</dt>
                    <dd className="mt-0.5 text-ink">{fmt.format(new Date(lead.created_at))}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-soft">{leadsPage.columns.source}</dt>
                    <dd className="mt-0.5 text-ink">{lead.utm_source ?? '—'}</dd>
                  </div>
                </dl>

                {lead.note ? (
                  <p className="mt-4 rounded-2xl bg-cream px-4 py-3 text-xs leading-[1.9] text-ink-soft">{lead.note}</p>
                ) : null}

                <div className="mt-4">
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
