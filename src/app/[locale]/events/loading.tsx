import PageHeaderSkeleton from "@/components/ui/skeletons/PageHeaderSkeleton";
import EventCardSkeleton from "@/components/ui/skeletons/EventCardSkeleton";

export default function EventsLoading() {
  return (
    <div className="min-h-screen pt-24">
      <PageHeaderSkeleton />
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
