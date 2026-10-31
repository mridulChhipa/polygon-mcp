import Link from 'next/link';
import { Home } from 'lucide-react';

interface BreadcrumbsProps {
  category: string;
  title: string;
}

export function Breadcrumbs({ category, title }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-xs font-mono font-bold text-black dark:text-zinc-300 mb-6 flex-wrap">
      <Link
        href="/"
        className="flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-[#181920] border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all text-black dark:text-white"
      >
        <Home className="w-3.5 h-3.5" strokeWidth={2.5} />
        <span>DOCS</span>
      </Link>
      <span className="text-black dark:text-white font-black">/</span>
      <span className="px-2 py-0.5 bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]">
        {category.toUpperCase()}
      </span>
      <span className="text-black dark:text-white font-black">/</span>
      <span className="px-2 py-0.5 bg-black text-white dark:bg-white dark:text-black font-black border-2 border-black dark:border-white truncate max-w-[280px]">
        {title.toUpperCase()}
      </span>
    </nav>
  );
}
