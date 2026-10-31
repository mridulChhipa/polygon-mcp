'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Terminal,
  Zap,
  ShieldCheck,
  Cpu,
  Layers,
  Wrench,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { Header } from '@/components/Header';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF5] dark:bg-[#0F1015] text-black dark:text-white">
      <Header />

      {/* Ticker Tape Status Banner */}
      <div className="w-full bg-[#FFE600] text-black border-b-2 border-black font-mono text-xs font-black py-2 overflow-x-auto whitespace-nowrap">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6">
          <span>&gt;&gt; CODEFORCES POLYGON MCP PROTOCOL 2.0</span>
          <span>//</span>
          <span>ZERO-TURN PROBLEM CREATION</span>
          <span>//</span>
          <span>LOCAL G++ &amp; TESTLIB.H PREFLIGHT</span>
          <span>//</span>
          <span>11/11 AUDIT CHECKLIST VERIFIED</span>
          <span>//</span>
          <span>CLAUDE CODE &bull; CURSOR &bull; ANTIGRAVITY &bull; WINDSURF</span>
          <span>//</span>
          <span>PACKAGE #1529830 READY</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-16 lg:pt-24 lg:pb-24 border-b-3 border-black dark:border-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#00F0FF] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] font-mono text-xs font-black tracking-wider uppercase">
              <Zap className="w-4 h-4 text-black" strokeWidth={3} />
              <span>MODEL CONTEXT PROTOCOL 2.0</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-black dark:text-white leading-[1.05]">
              Autonomous Problem Automation{' '}
              <span className="inline-block bg-[#FFE600] text-black border-3 border-black px-4 py-1.5 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] -rotate-1 mt-2 sm:mt-0">
                FOR POLYGON
              </span>
            </h1>

            <p className="text-base sm:text-lg font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-2xl mx-auto">
              Empower AI coding agents to create, compile with <span className="font-mono font-bold bg-[#FFE600] text-black px-1.5 py-0.5 border border-black shadow-[1px_1px_0px_0px_#000]">testlib.h</span>, test, audit, and package contest-ready competitive programming problems in a single turn without manual web UI friction.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/docs/getting-started/quickstart"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FFE600] text-black border-2 border-black font-mono font-black text-sm uppercase shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] dark:hover:shadow-[6px_6px_0px_0px_#fff] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
              >
                <span>5-MINUTE QUICKSTART</span>
                <ArrowRight className="w-4 h-4" strokeWidth={3} />
              </Link>
              <Link
                href="/docs/getting-started/overview"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-[#181920] text-black dark:text-white border-2 border-black dark:border-white font-mono font-black text-sm uppercase shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] dark:hover:shadow-[6px_6px_0px_0px_#fff] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
              >
                <BookOpen className="w-4 h-4" strokeWidth={3} />
                <span>READ THE DOCS</span>
              </Link>
            </div>
          </div>

          {/* Interactive Code / Benchmark Card (Retro Brutalist Terminal) */}
          <div className="mt-14 max-w-4xl mx-auto border-3 border-black dark:border-white bg-[#07080B] text-zinc-100 shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#fff] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#FFE600] text-black border-b-2 border-black font-mono font-black text-xs uppercase">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" strokeWidth={3} />
                <span>TERMINAL :: agent-polygon-pipeline.json</span>
              </div>
              <span className="px-2 py-0.5 bg-black text-[#00F0FF] font-mono text-[11px] font-black border border-black">
                80 TURNS &rarr; 1 TURN
              </span>
            </div>
            <div className="p-6 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-zinc-300">
              <div className="text-zinc-500">// 1-Turn Full Bundle Creation via Model Context Protocol</div>
              <div className="text-[#00F0FF] font-bold mt-2">await agent.callTool(&ldquo;polygon_create_problem_bundle&rdquo;, &#123;</div>
              <div className="pl-6 text-zinc-300">name: <span className="text-[#FFE600]">&ldquo;retro-keypad-phone&rdquo;</span>,</div>
              <div className="pl-6 text-zinc-300">time_limit_ms: <span className="text-[#FF7A00] font-bold">1000</span>, memory_limit_mb: <span className="text-[#FF7A00] font-bold">256</span>,</div>
              <div className="pl-6 text-zinc-300">validator_code: <span className="text-[#00F0FF]">&ldquo;#include &lsquo;testlib.h&rsquo; ...&rdquo;</span>, <span className="text-zinc-500">// Compiled locally in 150ms</span></div>
              <div className="pl-6 text-zinc-300">main_solution_code: <span className="text-[#00F0FF]">&ldquo;// O(M*N) DP solution ...&rdquo;</span>,</div>
              <div className="pl-6 text-zinc-300">other_solutions: [&#123; name: <span className="text-[#FFE600]">&ldquo;bruteforce.cpp&rdquo;</span>, tag: <span className="text-[#FF3B30] font-bold">&ldquo;TL&rdquo;</span> &#125;],</div>
              <div className="pl-6 text-zinc-300">sample_tests: [<span className="text-[#FFE600]">&ldquo;4 16\nabcd\n...&rdquo;</span>],</div>
              <div className="pl-6 text-zinc-300">build_package: <span className="text-[#D946EF] font-bold">true</span> <span className="text-zinc-500">// Asynchronous polling until READY</span></div>
              <div className="text-[#00F0FF] font-bold">&#125;);</div>
              <div className="mt-4 pt-4 border-t-2 border-zinc-800 text-[#22C55E] font-black">
                &gt;&gt; [OK] Package #1529830 READY | 16 Tests Passed | 11/11 Codeforces Checks Satisfied
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-20 bg-[#F4F2E9] dark:bg-[#12131A] border-b-3 border-black dark:border-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="px-3 py-1 font-mono text-xs font-black uppercase tracking-wider bg-black text-[#FFE600] dark:bg-white dark:text-black border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]">
              [ ENTERPRISE GRADE ARCHITECTURE ]
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-black dark:text-white uppercase tracking-tight pt-2">
              Built for Speed, Resilience &amp; Compliance
            </h2>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Addresses every protocol quirk, signature rule, and validation failure mode in Codeforces Polygon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-[#181920] border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] dark:hover:shadow-[6px_6px_0px_0px_#fff] transition-all">
              <div className="w-12 h-12 bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-black" strokeWidth={2.5} />
              </div>
              <h3 className="text-base font-mono font-black uppercase text-black dark:text-white mb-2">Two-Tier Tool Design</h3>
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Choose between single-turn composite workflows (<code className="font-mono font-bold bg-[#FFE600] text-black px-1 border border-black">polygon_create_problem_bundle</code>) or fine-grained primitives to update existing problems without context pollution.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-[#181920] border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] dark:hover:shadow-[6px_6px_0px_0px_#fff] transition-all">
              <div className="w-12 h-12 bg-[#00F0FF] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6 text-black" strokeWidth={2.5} />
              </div>
              <h3 className="text-base font-mono font-black uppercase text-black dark:text-white mb-2">Fail-Fast Preflight Engine</h3>
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Test-compiles <code className="font-mono font-bold bg-[#00F0FF] text-black px-1 border border-black">validator.cpp</code> and <code className="font-mono font-bold bg-[#00F0FF] text-black px-1 border border-black">gen.cpp</code> locally with <code className="font-mono font-bold bg-[#00F0FF] text-black px-1 border border-black">g++</code> and official <code className="font-mono font-bold bg-[#00F0FF] text-black px-1 border border-black">testlib.h</code> in 150ms before touching Polygon.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-[#181920] border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] dark:hover:shadow-[6px_6px_0px_0px_#fff] transition-all">
              <div className="w-12 h-12 bg-[#22C55E] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-black" strokeWidth={2.5} />
              </div>
              <h3 className="text-base font-mono font-black uppercase text-black dark:text-white mb-2">Codeforces Audit Checklist</h3>
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Automated 11-point audit verifying time limits, LaTeX math formulas, test coverage, negative validator rejection tests, and package verification status.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-[#181920] border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] dark:hover:shadow-[6px_6px_0px_0px_#fff] transition-all">
              <div className="w-12 h-12 bg-[#FF7A00] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center mb-4">
                <Terminal className="w-6 h-6 text-black" strokeWidth={2.5} />
              </div>
              <h3 className="text-base font-mono font-black uppercase text-black dark:text-white mb-2">Cryptographic Protocol Engine</h3>
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Strict SHA-512 signature hashing, canonical parameter sorting, and form-data byte normalization to eliminate signature mismatch bugs.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-[#181920] border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] dark:hover:shadow-[6px_6px_0px_0px_#fff] transition-all">
              <div className="w-12 h-12 bg-[#D946EF] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center mb-4">
                <Wrench className="w-6 h-6 text-black" strokeWidth={2.5} />
              </div>
              <h3 className="text-base font-mono font-black uppercase text-black dark:text-white mb-2">Directory Sync</h3>
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Point the agent at any local folder containing <code className="font-mono font-bold bg-[#D946EF] text-black px-1 border border-black">statement.md</code>, <code className="font-mono font-bold bg-[#D946EF] text-black px-1 border border-black">solution.cpp</code>, and <code className="font-mono font-bold bg-[#D946EF] text-black px-1 border border-black">tests/</code> to mirror everything automatically.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-[#181920] border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] dark:hover:shadow-[6px_6px_0px_0px_#fff] transition-all">
              <div className="w-12 h-12 bg-[#FF3B30] text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-base font-mono font-black uppercase text-black dark:text-white mb-2">Multi-Tenant Dynamic Auth</h3>
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Supports default environment keys, <code className="font-mono font-bold bg-[#FF3B30] text-white px-1 border border-black">.env</code> auto-discovery, and dynamic per-call credentials for multi-author teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-[#FFE600] text-black border-t-3 border-black font-mono text-xs font-bold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black uppercase">CODEFORCES POLYGON MCP SERVER</span>
            <span>&bull;</span>
            <span className="px-1.5 py-0.5 bg-black text-[#FFE600] border border-black">v0.1.0</span>
          </div>
          <div className="flex items-center gap-6 uppercase font-black">
            <Link href="/docs/getting-started/overview" className="hover:underline decoration-2">
              DOCS
            </Link>
            <Link href="/docs/tools/workflows" className="hover:underline decoration-2">
              TOOL REFERENCE
            </Link>
            <Link href="/docs/troubleshooting/common-errors" className="hover:underline decoration-2">
              TROUBLESHOOTING
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
