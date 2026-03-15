interface SkeletonBaseProps {
  className?: string;
}

export default function SkeletonBase({ className = "" }: SkeletonBaseProps) {
  return (
    <div
      className={`animate-pulse bg-foreground/10 rounded ${className}`}
    />
  );
}
