import PageHeaderSkeleton from "@/components/ui/skeletons/PageHeaderSkeleton";
import ArtistCardSkeleton from "@/components/ui/skeletons/ArtistCardSkeleton";

export default function ArtistsLoading() {
  return (
    <div className="min-h-screen pt-24">
      <PageHeaderSkeleton />
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <ArtistCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
