import SkeletonBase from "./SkeletonBase";

export default function EventCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-foreground/[0.06] bg-surface-light">
      {/* Image */}
      <SkeletonBase className="h-48 w-full rounded-none" />

      <div className="p-4 space-y-3">
        {/* Title */}
        <SkeletonBase className="h-5 w-3/4 rounded-lg" />
        {/* Subtitle */}
        <SkeletonBase className="h-3.5 w-1/2 rounded-lg" />

        {/* Meta chips */}
        <div className="flex gap-2 pt-1">
          <SkeletonBase className="h-6 w-16 rounded-full" />
          <SkeletonBase className="h-6 w-20 rounded-full" />
          <SkeletonBase className="h-6 w-14 rounded-full" />
        </div>

        {/* Price + button row */}
        <div className="flex items-center justify-between pt-1">
          <SkeletonBase className="h-5 w-16 rounded-lg" />
          <SkeletonBase className="h-8 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}
