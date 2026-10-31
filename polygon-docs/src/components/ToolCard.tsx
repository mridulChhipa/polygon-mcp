import React from 'react';
import { Wrench, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface ToolCardProps {
  name: string;
  tier: 'Tier 1' | 'Tier 2' | 'Resource';
  description: string;
  parameters: { name: string; type: string; required: boolean; desc: string }[];
  returns: string;
}

export function ToolCard({ name, tier, description, parameters, returns }: ToolCardProps) {
  const isTier1 = tier === 'Tier 1';
  const isResource = tier === 'Resource';

  const headerBg = isTier1
    ? 'bg-[#FFE600] text-black'
    : isResource
    ? 'bg-[#E0B0FF] text-black'
    : 'bg-[#00F0FF] text-black';

  return (
    <div className="my-6 border-2 border-black dark:border-white bg-white dark:bg-[#181920] shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#fff] overflow-hidden transition-all">
      {/* Header Band */}
      <div className={`p-4 border-b-2 border-black dark:border-white ${headerBg} flex flex-wrap items-center justify-between gap-3`}>
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_#000]">
            {isTier1 ? (
              <Zap className="w-5 h-5 text-black" strokeWidth={3} />
            ) : isResource ? (
              <ShieldCheck className="w-5 h-5 text-black" strokeWidth={2.5} />
            ) : (
              <Wrench className="w-5 h-5 text-black" strokeWidth={2.5} />
            )}
          </div>
          <div>
            <h3 className="text-base font-mono font-black uppercase text-black tracking-tight">
              {name}
            </h3>
            <p className="text-[11px] font-mono font-bold text-black/80 uppercase">
              {isResource ? '// MCP RESOURCE' : isTier1 ? '// COMPOSITE WORKFLOW TOOL' : '// TARGETED PRIMITIVE TOOL'}
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-black text-white font-mono text-xs font-black uppercase border border-black shadow-[2px_2px_0px_0px_#000]">
          [{tier}]
        </span>
      </div>

      <div className="p-5 space-y-4">
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
          {description}
        </p>

        {parameters && parameters.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-black uppercase tracking-wider text-black dark:text-white">
              // PARAMETERS SPECIFICATION
            </h4>
            <div className="overflow-x-auto border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#FFE600] text-black border-b-2 border-black font-black uppercase">
                  <tr>
                    <th className="py-2 px-3">PARAMETER</th>
                    <th className="py-2 px-3">TYPE</th>
                    <th className="py-2 px-3">REQUIRED</th>
                    <th className="py-2 px-3">DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 dark:divide-white/10 text-zinc-800 dark:text-zinc-200">
                  {parameters.map((p) => (
                    <tr key={p.name} className="hover:bg-[#FFE600]/10">
                      <td className="py-2 px-3 font-bold text-black dark:text-white">
                        <span className="px-1.5 py-0.5 bg-black/5 dark:bg-white/10 border border-black/30 dark:border-white/30">
                          {p.name}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-zinc-600 dark:text-zinc-400">{p.type}</td>
                      <td className="py-2 px-3">
                        {p.required ? (
                          <span className="px-1.5 py-0.5 bg-[#FF3B30] text-white font-black text-[10px] border border-black">
                            YES
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 bg-zinc-200 text-black font-black text-[10px] border border-black">
                            NO
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 font-sans font-medium text-xs">{p.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pt-3 text-xs font-mono border-t-2 border-black dark:border-white">
          <ArrowRight className="w-4 h-4 text-black dark:text-white" strokeWidth={3} />
          <span className="font-black text-black dark:text-white uppercase">RETURNS:</span>
          <code className="px-2 py-0.5 bg-[#FFE600] text-black font-bold border border-black shadow-[1px_1px_0px_0px_#000]">
            {returns}
          </code>
        </div>
      </div>
    </div>
  );
}
