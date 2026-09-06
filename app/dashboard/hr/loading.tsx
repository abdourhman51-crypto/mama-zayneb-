import { SkeletonBlock } from '@/components/dashboard/Skeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SkeletonBlock className="h-14 w-14 rounded-3xl" />
      <SkeletonBlock className="h-8 w-2/3" />
      <SkeletonBlock className="h-5 w-1/2" />
      <div className="space-y-3 pt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-16" />
        ))}
      </div>
    </div>
  );
}
