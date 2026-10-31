'use client';

import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, Key, Globe, Terminal } from 'lucide-react';

export interface EnvVariableItem {
  name: string;
  aliases?: string[];
  type: string;
  required: boolean;
  defaultValue?: string;
  description: string;
}

export const defaultEnvVariables: EnvVariableItem[] = [
  {
    name: 'POLYGON_API_KEY',
    aliases: ['POLYGON_KEY'],
    type: 'string',
    required: true,
    defaultValue: 'None',
    description: 'Codeforces Polygon API Key generated from Settings -> API Keys on polygon.codeforces.com. Used to identify the calling account.',
  },
  {
    name: 'POLYGON_API_SECRET',
    aliases: ['POLYGON_SECRET'],
    type: 'string (secret)',
    required: true,
    defaultValue: 'None',
    description: 'Cryptographic secret key used to compute the SHA-512 signature (apiSig) for every request. Never logged or exposed in outputs.',
  },
  {
    name: 'POLYGON_BASE_URL',
    aliases: [],
    type: 'string (url)',
    required: false,
    defaultValue: 'https://polygon.codeforces.com/api/',
    description: 'Target Polygon API endpoint. Change only if running against a custom or self-hosted Polygon mirror/instance.',
  },
  {
    name: 'PYTHONIOENCODING',
    aliases: [],
    type: 'string',
    required: false,
    defaultValue: 'utf-8',
    description: 'Ensures standard input/output streams use UTF-8. Critical on Windows PowerShell to prevent charmap encoding errors during test upload.',
  },
];

export function EnvVariablesTable({ variables = defaultEnvVariables }: { variables?: EnvVariableItem[] }) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="my-6 border-2 border-black dark:border-white bg-white dark:bg-[#181920] shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#fff] overflow-hidden">
      <div className="p-3 bg-[#FFE600] text-black border-b-2 border-black flex items-center justify-between font-mono font-black uppercase text-xs">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-black" strokeWidth={3} />
          <span>ENVIRONMENT VARIABLES SPECIFICATION</span>
        </div>
        <span className="text-[11px] bg-black text-[#FFE600] px-2 py-0.5 border border-black font-mono font-bold">
          EXPLICIT ARG &gt; PROCESS ENV &gt; .ENV
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-black text-white dark:bg-white dark:text-black border-b-2 border-black dark:border-white font-mono font-black text-xs uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">VARIABLE NAME</th>
              <th className="py-3 px-4">TYPE</th>
              <th className="py-3 px-4">REQUIRED</th>
              <th className="py-3 px-4">DEFAULT</th>
              <th className="py-3 px-4">DESCRIPTION &amp; NOTES</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black/10 dark:divide-white/10 text-zinc-900 dark:text-zinc-100 font-medium">
            {variables.map((item) => (
              <tr key={item.name} className="hover:bg-[#FFE600]/15 transition-colors">
                <td className="py-3.5 px-4 align-top">
                  <div className="flex items-center gap-2">
                    <code className="font-mono font-bold text-black bg-[#FFE600] px-2 py-0.5 border border-black shadow-[1.5px_1.5px_0px_0px_#000] text-xs">
                      {item.name}
                    </code>
                    <button
                      onClick={() => copyToClipboard(item.name)}
                      className="p-1 border border-black bg-white text-black shadow-[1px_1px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                      title="Copy variable name"
                    >
                      {copiedKey === item.name ? (
                        <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                      )}
                    </button>
                  </div>
                  {item.aliases && item.aliases.length > 0 && (
                    <div className="mt-1 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                      ALIAS: <code className="font-bold text-black dark:text-white">{item.aliases.join(', ')}</code>
                    </div>
                  )}
                </td>

                <td className="py-3.5 px-4 align-top">
                  <span className="font-mono text-xs font-bold text-black dark:text-white px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-black dark:border-white">
                    {item.type}
                  </span>
                </td>

                <td className="py-3.5 px-4 align-top">
                  {item.required ? (
                    <span className="inline-flex items-center px-2 py-0.5 font-mono text-[10px] font-black uppercase bg-[#FF3B30] text-white border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
                      [REQUIRED]
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 font-mono text-[10px] font-black uppercase bg-zinc-200 text-black border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
                      [OPTIONAL]
                    </span>
                  )}
                </td>

                <td className="py-3.5 px-4 align-top">
                  <code className="font-mono text-xs font-bold text-black dark:text-white">
                    {item.defaultValue}
                  </code>
                </td>

                <td className="py-3.5 px-4 align-top leading-relaxed text-xs sm:text-sm">
                  {item.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Generic Markdown Table renderer component
 */
export function MarkdownTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-6 overflow-x-auto border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] bg-white dark:bg-[#181920]">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="bg-[#FFE600] text-black border-b-2 border-black font-mono font-black uppercase text-xs tracking-wider">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="py-3 px-4">
                <span dangerouslySetInnerHTML={{ __html: h }} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-black/10 dark:divide-white/10 text-zinc-900 dark:text-zinc-100 font-medium">
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-[#FFE600]/10 transition-colors">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="py-3 px-4">
                  <span dangerouslySetInnerHTML={{ __html: cell }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
