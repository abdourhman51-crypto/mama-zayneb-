import { SkeletonBlock } from '@/components/dashboard/Skeleton';

/**
 * يظهر فوراً عند النقر على «التسجيلات» قبل وصول البيانات —
 * حتى لا يشعر المستخدم أن الضغطة لم تُسجَّل.
 */
export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-28" />
        ))}
      </div>
      <SkeletonBlock className="h-14" />
      <div className="space-y-3.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-24" />
        ))}
      </div>
    </div>
  );
}
