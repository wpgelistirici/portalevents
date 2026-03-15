import SkeletonBase from "./SkeletonBase";

export default function VenueCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-foreground/[0.06] bg-surface-light">
      {/* Image */}
      <SkeletonBase className="h-44 w-full rounded-none" />

      <div className="p-4 space-y-3">
        {/* Name */}
        <SkeletonBase className="h-5 w-2/3 rounded-lg" />
        {/* City */}
        <SkeletonBase className="h-3.5 w-1/3 rounded-lg" />
        {/* Capacity chip */}
        <SkeletonBase className="h-6 w-24 rounded-full" />
      </div>
    </div>
  );
}
