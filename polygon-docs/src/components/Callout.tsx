import React from 'react';
import { Info, Lightbulb, AlertCircle, AlertTriangle, ShieldAlert } from 'lucide-react';

type CalloutType = 'note' | 'tip' | 'important' | 'warning' | 'caution';

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const config = {
  note: {
    icon: Info,
    bg: 'bg-[#E0F7FA] dark:bg-[#042F2E]',
    tagBg: 'bg-[#00F0FF]',
    tagText: 'text-black',
    textColor: 'text-zinc-900 dark:text-cyan-100',
    defaultTitle: 'NOTE',
  },
  tip: {
    icon: Lightbulb,
    bg: 'bg-[#DCFCE7] dark:bg-[#052E16]',
    tagBg: 'bg-[#22C55E]',
    tagText: 'text-black',
    textColor: 'text-zinc-900 dark:text-emerald-100',
    defaultTitle: 'TIP',
  },
  important: {
    icon: AlertCircle,
    bg: 'bg-[#FEF9C3] dark:bg-[#3E2B00]',
    tagBg: 'bg-[#FFE600]',
    tagText: 'text-black',
    textColor: 'text-zinc-900 dark:text-amber-100',
    defaultTitle: 'IMPORTANT',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-[#FFEDD5] dark:bg-[#431407]',
    tagBg: 'bg-[#FF7A00]',
    tagText: 'text-black',
    textColor: 'text-zinc-900 dark:text-orange-100',
    defaultTitle: 'WARNING',
  },
  caution: {
    icon: ShieldAlert,
    bg: 'bg-[#FFE4E6] dark:bg-[#4C0519]',
    tagBg: 'bg-[#FF3B30]',
    tagText: 'text-white',
    textColor: 'text-zinc-900 dark:text-rose-100',
    defaultTitle: 'CAUTION',
  },
};

export function Callout({ type = 'note', title, children }: CalloutProps) {
  const current = config[type] || config.note;
  const Icon = current.icon;

  return (
    <div className={`my-5 p-4 border-2 border-black dark:border-white ${current.bg} shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] transition-all`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0 p-1 border-2 border-black bg-white dark:bg-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]">
          <Icon className="w-4 h-4 text-black dark:text-white" strokeWidth={2.5} />
        </div>
        <div className="space-y-2 text-xs sm:text-sm leading-relaxed flex-1">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 font-mono text-[10px] font-black uppercase border border-black shadow-[1px_1px_0px_0px_#000] ${current.tagBg} ${current.tagText}`}>
              [ {title ? title.toUpperCase() : current.defaultTitle} ]
            </span>
          </div>
          <div className={`font-medium ${current.textColor}`}>{children}</div>
        </div>
      </div>
    </div>
  );
}
