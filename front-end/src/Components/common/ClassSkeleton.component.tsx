import { JSX } from "react";

interface ClassSkeletonProps {
  count?: number;
}

export default function ClassSkeleton({ count = 6 }: ClassSkeletonProps): JSX.Element {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="h-44 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 flex flex-col justify-between animate-pulse shadow-xs"
        >
          <div className="flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-zinc-800" />
            <div className="h-5 bg-slate-200 dark:bg-zinc-800 rounded-lg w-3/4" />
            <div className="h-4 bg-slate-100 dark:bg-zinc-800/60 rounded-md w-1/2" />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-zinc-800/80">
            <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-16" />
            <div className="flex gap-2">
              <div className="h-7 w-12 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
              <div className="h-7 w-10 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
