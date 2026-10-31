'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, Hash, ArrowRight } from 'lucide-react';
import { navigationData } from '@/data/navigation';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle if needed
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  // Flatten searchable items
  const allItems = navigationData.flatMap((section) =>
    section.items.map((item) => ({
      ...item,
      section: section.title,
    }))
  );

  const results = query.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.section.toLowerCase().includes(query.toLowerCase())
      )
    : allItems.slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 animate-in fade-in duration-100">
      <div className="w-full max-w-xl bg-[#FFFDF5] dark:bg-[#0F1015] border-3 border-black dark:border-white shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#fff]">
        <div className="flex items-center px-4 py-3 border-b-2 border-black dark:border-white bg-[#FFE600] text-black">
          <Search className="w-5 h-5 text-black mr-3 shrink-0" strokeWidth={3} />
          <input
            type="text"
            placeholder="TYPE TO SEARCH DOCS & GUIDES... (ESC)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent font-mono text-sm font-bold text-black placeholder-zinc-800 focus:outline-none uppercase"
          />
          <button
            onClick={onClose}
            className="p-1 border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <X className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 space-y-1 bg-[#FFFDF5] dark:bg-[#0F1015]">
          {results.length > 0 ? (
            results.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between p-2.5 font-mono border-2 border-transparent hover:border-black dark:hover:border-white hover:bg-[#FFE600] hover:text-black dark:hover:bg-[#FFE600] dark:hover:text-black transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1 bg-black text-white dark:bg-white dark:text-black group-hover:bg-black group-hover:text-[#FFE600] text-xs font-black">
                    <Hash className="w-4 h-4" strokeWidth={3} />
                  </div>
                  <div>
                    <div className="text-sm font-black text-black dark:text-white group-hover:text-black">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 font-bold uppercase">
                      // {item.section}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-black opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" strokeWidth={3} />
              </Link>
            ))
          ) : (
            <div className="py-8 text-center font-mono text-sm font-bold text-zinc-500 dark:text-zinc-400">
              NO MATCHES FOUND FOR &ldquo;{query.toUpperCase()}&rdquo;
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black border-t-2 border-black dark:border-white text-[11px] font-mono font-bold flex items-center justify-between">
          <span>NAVIGATE WITH ARROWS OR MOUSE</span>
          <span>POLYGON MCP PROTOCOL</span>
        </div>
      </div>
    </div>
  );
}
