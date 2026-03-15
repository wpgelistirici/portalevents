import PageHeaderSkeleton from "@/components/ui/skeletons/PageHeaderSkeleton";
import SkeletonBase from "@/components/ui/skeletons/SkeletonBase";

export default function CommunityLoading() {
  return (
    <div className="min-h-screen pt-24">
      <PageHeaderSkeleton />
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-foreground/[0.06] bg-surface-light p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <SkeletonBase className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <SkeletonBase className="h-4 w-32 rounded-lg" />
                  <SkeletonBase className="h-3 w-20 rounded-lg" />
                </div>
              </div>
              <SkeletonBase className="h-4 w-full rounded-lg" />
              <SkeletonBase className="h-4 w-5/6 rounded-lg" />
              <div className="flex gap-3 pt-1">
                <SkeletonBase className="h-6 w-16 rounded-full" />
                <SkeletonBase className="h-6 w-16 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
