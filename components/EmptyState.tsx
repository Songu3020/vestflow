import Link from "next/link";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
}

export default function EmptyState({
  icon = "📭",
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  secondaryActionLabel,
  secondaryActionHref,
}: EmptyStateProps) {
  return (
    <div className="card p-16 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6">
        <span className="text-4xl" role="img" aria-label={title}>
          {icon}
        </span>
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 max-w-md mx-auto mb-6">{description}</p>

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex gap-3 justify-center flex-wrap">
          {actionLabel && actionHref && (
            <Link
              href={actionHref}
              className="btn-primary rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
            >
              {actionLabel}
            </Link>
          )}
          
          {actionLabel && onAction && !actionHref && (
            <button
              onClick={onAction}
              className="btn-primary rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
            >
              {actionLabel}
            </button>
          )}

          {secondaryActionLabel && secondaryActionHref && (
            <Link
              href={secondaryActionHref}
              className="text-sm text-zinc-400 hover:text-white border border-white/10 rounded-lg px-5 py-2.5 transition-colors"
            >
              {secondaryActionLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export function NoSchedulesEmptyState({ isConnected }: { isConnected: boolean }) {
  if (!isConnected) {
    return (
      <EmptyState
        icon="🔐"
        title="Connect Your Wallet"
        description="Connect your Stellar wallet to view and manage your vesting schedules."
      />
    );
  }

  return (
    <EmptyState
      icon="🎯"
      title="No Vesting Schedules"
      description="You don't have any vesting schedules yet. Create your first schedule to get started with token vesting."
      actionLabel="Create Your First Schedule"
      actionHref="/app/create"
      secondaryActionLabel="Learn About Vesting"
      secondaryActionHref="/learn"
    />
  );
}

export function NoSearchResultsEmptyState({ 
  searchQuery, 
  onClearSearch 
}: { 
  searchQuery: string; 
  onClearSearch: () => void;
}) {
  return (
    <EmptyState
      icon="🔍"
      title="No Results Found"
      description={`No schedules match "${searchQuery}". Try a different address or clear the search.`}
      actionLabel="Clear Search"
      onAction={onClearSearch}
    />
  );
}

export function NoGrantorSchedulesEmptyState() {
  return (
    <EmptyState
      icon="📤"
      title="No Schedules as Grantor"
      description="You haven't created any vesting schedules yet. Create a schedule to start vesting tokens to beneficiaries."
      actionLabel="Create Schedule"
      actionHref="/app/create"
    />
  );
}

export function NoBeneficiarySchedulesEmptyState() {
  return (
    <EmptyState
      icon="📥"
      title="No Schedules as Beneficiary"
      description="You don't have any vesting schedules where you're receiving tokens. When someone creates a schedule for you, it will appear here."
      secondaryActionLabel="View All Schedules"
      secondaryActionHref="/app"
    />
  );
}

export function LoadingEmptyState() {
  return (
    <div className="card p-16 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6 animate-pulse">
        <div className="w-8 h-8 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Loading Schedules</h3>
      <p className="text-zinc-400">Fetching your vesting schedules from the blockchain...</p>
    </div>
  );
}
