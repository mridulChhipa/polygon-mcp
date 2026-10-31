'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Sun, Moon, Github, Menu, X, Terminal, Cpu } from 'lucide-react';
import { SearchModal } from './SearchModal';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export function Header({ onMobileMenuToggle, isMobileMenuOpen }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FFFDF5] dark:bg-[#0F1015] border-b-2 border-black dark:border-white transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            {onMobileMenuToggle && (
              <button
                onClick={onMobileMenuToggle}
                className="lg:hidden p-2 border-2 border-black dark:border-white bg-white dark:bg-[#181920] text-black dark:text-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                aria-label="Toggle Navigation"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" strokeWidth={3} /> : <Menu className="w-4 h-4" strokeWidth={3} />}
              </button>
            )}

            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] flex items-center justify-center group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[3px_3px_0px_0px_#000] dark:group-hover:shadow-[3px_3px_0px_0px_#fff] transition-all">
                <Terminal className="w-5 h-5" strokeWidth={3} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-black dark:text-white text-base tracking-tight uppercase">
                    POLYGON MCP
                  </span>
                  <span className="px-1.5 py-0.2 bg-black text-[#FFE600] dark:bg-white dark:text-black font-mono text-[10px] font-black border border-black dark:border-white">
                    v0.1.0
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono font-bold tracking-wider uppercase">
                  CODEFORCES PROTOCOL
                </span>
              </div>
            </Link>
          </div>

          {/* Search Trigger */}
          <div className="flex-1 max-w-md hidden md:block">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-1.5 border-2 border-black dark:border-white bg-white dark:bg-[#181920] text-zinc-600 dark:text-zinc-300 text-xs shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000] dark:hover:shadow-[3px_3px_0px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-black dark:text-white" strokeWidth={2.5} />
                <span className="font-mono font-bold text-black dark:text-white">SEARCH DOCS &amp; TOOLS...</span>
              </div>
              <kbd className="px-1.5 py-0.5 bg-[#FFE600] text-black font-mono text-[10px] font-black border border-black shadow-[1px_1px_0px_0px_#000]">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 border-2 border-black dark:border-white bg-white dark:bg-[#181920] text-black dark:text-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              aria-label="Search"
            >
              <Search className="w-4 h-4" strokeWidth={2.5} />
            </button>

            <Link
              href="/docs/getting-started/quickstart"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-black uppercase bg-[#00F0FF] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <Cpu className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span>QUICKSTART</span>
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 border-2 border-black dark:border-white bg-white dark:bg-[#181920] text-black dark:text-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000] dark:hover:shadow-[3px_3px_0px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-[#FFE600]" strokeWidth={2.5} /> : <Moon className="w-4 h-4 text-black dark:text-white" strokeWidth={2.5} />}
            </button>

            <a
              href="https://codeforces.com/polygon"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border-2 border-black dark:border-white bg-white dark:bg-[#181920] text-black dark:text-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000] dark:hover:shadow-[3px_3px_0px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              title="Codeforces Polygon Web"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.5 7.5a1.5 1.5 0 0 1 1.5-1.5h1.5a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5v-11zm6-4.5a1.5 1.5 0 0 1 1.5-1.5h1.5a1.5 1.5 0 0 1 1.5 1.5v15.5a1.5 1.5 0 0 1-1.5 1.5h-1.5a1.5 1.5 0 0 1-1.5-1.5V3zm6 7.5a1.5 1.5 0 0 1 1.5-1.5h1.5a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H18a1.5 1.5 0 0 1-1.5-1.5v-8z" />
              </svg>
            </a>

            <a
              href="https://github.com/mridulChhipa/polygon-mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border-2 border-black dark:border-white bg-[#FFE600] text-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000] dark:hover:shadow-[3px_3px_0px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              title="GitHub Repository"
            >
              <Github className="w-4 h-4" strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
