import SkeletonBase from "./SkeletonBase";

export default function ArtistCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-foreground/[0.06] bg-surface-light p-5 flex flex-col items-center gap-3">
      {/* Avatar */}
      <SkeletonBase className="w-20 h-20 rounded-full" />
      {/* Name */}
      <SkeletonBase className="h-5 w-28 rounded-lg" />
      {/* Genre */}
      <SkeletonBase className="h-3.5 w-20 rounded-lg" />
      {/* Stats row */}
      <div className="flex gap-3 w-full justify-center pt-1">
        <SkeletonBase className="h-6 w-16 rounded-full" />
        <SkeletonBase className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}
