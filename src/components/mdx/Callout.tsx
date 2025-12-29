import { ReactNode } from 'react';
import { AlertCircle, Info, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';

type CalloutType = 'note' | 'info' | 'warn' | 'warning' | 'success' | 'tip';

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const calloutStyles: Record<CalloutType, { icon: typeof Info; bgClass: string; borderClass: string; iconClass: string }> = {
  note: {
    icon: AlertCircle,
    bgClass: 'bg-blue-50 dark:bg-blue-950/30',
    borderClass: 'border-blue-400 dark:border-blue-600',
    iconClass: 'text-blue-500',
  },
  info: {
    icon: Info,
    bgClass: 'bg-sky-50 dark:bg-sky-950/30',
    borderClass: 'border-sky-400 dark:border-sky-600',
    iconClass: 'text-sky-500',
  },
  warn: {
    icon: AlertTriangle,
    bgClass: 'bg-amber-50 dark:bg-amber-950/30',
    borderClass: 'border-amber-400 dark:border-amber-600',
    iconClass: 'text-amber-500',
  },
  warning: {
    icon: AlertTriangle,
    bgClass: 'bg-amber-50 dark:bg-amber-950/30',
    borderClass: 'border-amber-400 dark:border-amber-600',
    iconClass: 'text-amber-500',
  },
  success: {
    icon: CheckCircle,
    bgClass: 'bg-green-50 dark:bg-green-950/30',
    borderClass: 'border-green-400 dark:border-green-600',
    iconClass: 'text-green-500',
  },
  tip: {
    icon: Lightbulb,
    bgClass: 'bg-purple-50 dark:bg-purple-950/30',
    borderClass: 'border-purple-400 dark:border-purple-600',
    iconClass: 'text-purple-500',
  },
};

export default function Callout({ type = 'note', title, children }: CalloutProps) {
  const style = calloutStyles[type];
  const Icon = style.icon;

  return (
    <div
      className={`my-6 rounded-lg border-l-4 p-4 ${style.bgClass} ${style.borderClass}`}
      role="note"
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${style.iconClass}`} />
        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-semibold text-foreground mb-1">{title}</p>
          )}
          <div className="text-foreground-muted prose-interop [&>p]:my-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

