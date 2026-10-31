'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language = 'bash', filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="relative my-5 border-2 border-black dark:border-white bg-[#07080B] text-zinc-100 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-[#181920] border-b-2 border-black dark:border-white text-xs font-mono font-bold">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#FFE600] border border-black" />
          <span className="px-1.5 py-0.2 bg-[#FFE600] text-black text-[10px] font-black uppercase border border-black shadow-[1px_1px_0px_0px_#000]">
            {filename || language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-white text-black dark:bg-[#FFE600] dark:text-black border-2 border-black font-mono font-black text-xs shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />
              <span>COPIED</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
              <span>COPY</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed text-zinc-200">
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
