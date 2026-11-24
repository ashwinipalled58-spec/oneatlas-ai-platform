import { SearchX, AlertCircle, ServerCrash, Inbox } from "lucide-react";

type EmptyStateProps = {
  type?: "search" | "error" | "empty" | "server";
  title?: string;
  message?: string;
  action?: React.ReactNode;
};

export default function EmptyState({
  type = "empty",
  title,
  message,
  action,
}: EmptyStateProps) {
  const configs = {
    search: {
      Icon: SearchX,
      defaultTitle: "No results found",
      defaultMessage: "Try adjusting your search or filters.",
      color: "text-slate-500",
    },
    error: {
      Icon: AlertCircle,
      defaultTitle: "Something went wrong",
      defaultMessage: "An error occurred. Please try again.",
      color: "text-red-400",
    },
    server: {
      Icon: ServerCrash,
      defaultTitle: "Database not connected",
      defaultMessage: "Could not reach the database. Run migrations and seed first.",
      color: "text-amber-400",
    },
    empty: {
      Icon: Inbox,
      defaultTitle: "Nothing here yet",
      defaultMessage: "No items to display.",
      color: "text-slate-500",
    },
  };

  const { Icon, defaultTitle, defaultMessage, color } = configs[type];

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] p-16 text-center">
      <div className={`mb-4 ${color}`}>
        <Icon className="h-12 w-12 mx-auto opacity-50" />
      </div>
      <h3 className="text-lg font-semibold text-white">{title ?? defaultTitle}</h3>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">{message ?? defaultMessage}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
