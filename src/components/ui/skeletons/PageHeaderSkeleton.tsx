import SkeletonBase from "./SkeletonBase";

export default function PageHeaderSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 px-6 text-center">
      <SkeletonBase className="h-4 w-24 rounded-full" />
      <SkeletonBase className="h-10 w-64 rounded-xl" />
      <SkeletonBase className="h-4 w-80 rounded-lg" />
    </div>
  );
}
