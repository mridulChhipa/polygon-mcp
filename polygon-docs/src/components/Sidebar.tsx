'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Rocket,
  Layers,
  Wrench,
  BookOpen,
  Server,
  HelpCircle,
  FileCode,
} from 'lucide-react';
import { navigationData } from '@/data/navigation';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Rocket,
  Layers,
  Wrench,
  BookOpen,
  Server,
  HelpCircle,
};

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden animate-in fade-in"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-72 bg-[#FFFDF5] dark:bg-[#0F1015] border-r-2 border-black dark:border-white overflow-y-auto p-4 transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-[6px_0px_0px_0px_#000] dark:shadow-[6px_0px_0px_0px_#fff]' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6 pb-12">
          {navigationData.map((section) => {
            const Icon = iconMap[section.iconName] || FileCode;

            return (
              <div key={section.title} className="space-y-1.5">
                <div className="flex items-center gap-2 px-2 py-1 text-[11px] font-mono font-black tracking-widest uppercase text-black dark:text-white border-b-2 border-black dark:border-white pb-1 mb-2">
                  <Icon className="w-3.5 h-3.5 text-black dark:text-[#FFE600]" strokeWidth={2.5} />
                  <span>// {section.title}</span>
                </div>

                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={`flex items-center justify-between px-3 py-1.5 text-xs font-mono font-bold transition-all ${
                            isActive
                              ? 'bg-[#FFE600] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] translate-x-1'
                              : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                          }`}
                        >
                          <span className="truncate">{item.title}</span>
                          {item.badge && (
                            <span
                              className={`ml-2 px-1 py-0.2 text-[9px] font-mono font-black uppercase border border-black dark:border-white ${
                                item.badge === 'Tier 1' || item.badge === 'Fast Track'
                                  ? 'bg-[#FFE600] text-black'
                                  : item.badge === 'Core' || item.badge === 'Essential'
                                  ? 'bg-[#22C55E] text-black'
                                  : 'bg-white dark:bg-black text-black dark:text-white'
                              }`}
                            >
                              [{item.badge}]
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
