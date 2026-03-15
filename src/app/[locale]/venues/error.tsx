"use client";

import ErrorBoundaryContent from "@/components/ui/ErrorBoundaryContent";

export default function VenuesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorBoundaryContent error={error} reset={reset} />;
}
