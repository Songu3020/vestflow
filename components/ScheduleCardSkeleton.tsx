export default function ScheduleCardSkeleton() {
  return (
    <div className="card p-5 flex flex-col gap-3 relative overflow-hidden">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      <div className="flex items-start justify-between relative">
        <div className="flex flex-col gap-2">
          <div className="h-4 w-24 rounded bg-white/5 animate-pulse" />
          <div className="h-3 w-20 rounded bg-white/5 animate-pulse" />
        </div>
        <div className="h-5 w-20 rounded-full bg-white/5 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 relative">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="h-3 w-12 rounded bg-white/5 animate-pulse" />
            <div className="h-3.5 w-28 rounded bg-white/5 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 mt-1 relative">
        <div className="flex justify-between">
          <div className="h-3 w-10 rounded bg-white/5 animate-pulse" />
          <div className="h-3 w-8 rounded bg-white/5 animate-pulse" />
        </div>
        <div className="h-1.5 rounded-full bg-white/5 animate-pulse" />
      </div>

      <div className="h-3 w-24 rounded bg-white/5 mt-1 animate-pulse relative" />

      <div className="flex gap-2 mt-2 relative">
        <div className="h-7 w-28 rounded-lg bg-white/5 animate-pulse" />
        <div className="h-7 w-20 rounded-lg bg-white/5 animate-pulse" style={{ animationDelay: '0.2s' }} />
      </div>
    </div>
  );
}

export function ScheduleListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ScheduleCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ScheduleDetailSkeleton() {
  return (
    <div className="card p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-6 w-32 rounded bg-white/5 animate-pulse" />
          <div className="h-4 w-24 rounded bg-white/5 animate-pulse" />
        </div>
        <div className="h-6 w-24 rounded-full bg-white/5 animate-pulse" />
      </div>

      <div className="border-t border-white/5 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-3 w-16 rounded bg-white/5 animate-pulse" />
              <div className="h-4 w-full rounded bg-white/5 animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/5 pt-4">
        <div className="h-4 w-32 rounded bg-white/5 mb-3 animate-pulse" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
