'use client';

import React, { useEffect, useState } from 'react';
import { TableOfContentItem } from '@/types/docs';
import { AlignLeft } from 'lucide-react';

interface TableOfContentsProps {
  items: TableOfContentItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -70% 0px' }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <div className="hidden xl:block w-64 shrink-0 pl-8 pr-4 py-8">
      <div className="sticky top-24 space-y-3">
        <div className="flex items-center gap-2 text-[11px] font-mono font-black uppercase tracking-widest text-black dark:text-white border-b-2 border-black dark:border-white pb-1">
          <AlignLeft className="w-3.5 h-3.5 text-black dark:text-[#FFE600]" strokeWidth={3} />
          <span>// ON THIS PAGE</span>
        </div>
        <ul className="space-y-1 text-xs font-mono">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id} className={item.level === 3 ? 'pl-3' : ''}>
                <a
                  href={`#${item.id}`}
                  className={`block px-2 py-1 transition-all ${
                    isActive
                      ? 'bg-[#FFE600] text-black font-black border border-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] translate-x-0.5'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                >
                  {isActive ? '> ' : '· '}
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
