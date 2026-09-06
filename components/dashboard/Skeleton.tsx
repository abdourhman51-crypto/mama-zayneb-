/** كتلة هيكلية بلون هادئ لصفحات التحميل — لا نصّ ولا بيانات وهمية. */
export function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-ink/[0.06] ${className}`} />;
}
