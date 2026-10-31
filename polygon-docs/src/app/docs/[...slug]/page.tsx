import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { TableOfContents } from '@/components/TableOfContents';
import { CodeBlock } from '@/components/CodeBlock';
import { Callout } from '@/components/Callout';
import { EnvVariablesTable, MarkdownTable } from '@/components/Table';
import { docsContentMap } from '@/data/docsContent';
import { ArrowLeft, ArrowRight, Calendar, Bookmark } from 'lucide-react';

interface DocPageProps {
  params: {
    slug: string[];
  };
}

export function generateStaticParams() {
  return Object.keys(docsContentMap).map((key) => ({
    slug: key.split('/'),
  }));
}

export default function DocPage({ params }: DocPageProps) {
  const slugKey = params.slug ? params.slug.join('/') : '';
  const doc = docsContentMap[slugKey];

  if (!doc) {
    notFound();
  }

  return (
    <>
      <div className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-8 max-w-4xl">
        <Breadcrumbs category={doc.category} title={doc.title} />

        {/* Header */}
        <div className="space-y-4 pb-8 border-b-3 border-black dark:border-white">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-xs font-black uppercase tracking-wider bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <Bookmark className="w-3.5 h-3.5 text-black" strokeWidth={3} />
              <span>[ {doc.category} ]</span>
            </span>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400">
              <Calendar className="w-3.5 h-3.5 text-black dark:text-white" strokeWidth={2.5} />
              <span>UPDATED: {doc.lastUpdated.toUpperCase()}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black dark:text-white leading-tight">
            {doc.title}
          </h1>

          <p className="text-base text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
            {doc.description}
          </p>
        </div>

        {/* Content Sections */}
        <div className="py-8 space-y-12">
          {doc.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black dark:text-white pb-2 border-b-2 border-black dark:border-white">
                # {section.title}
              </h2>

              {section.id === 'env-variables' ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
                    The Polygon MCP server automatically loads credentials from environment variables or your local <code className="px-1.5 py-0.5 bg-[#FFE600] text-black font-mono text-xs font-bold border border-black shadow-[1px_1px_0px_0px_#000]">.env</code> file. Configure the following variables:
                  </p>
                  <EnvVariablesTable />
                </div>
              ) : (
                <div className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans space-y-3">
                  {renderFormattedContent(section.content)}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Navigation Pagination (Prev / Next) */}
        <div className="mt-12 pt-8 border-t-3 border-black dark:border-white grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
          {doc.prevPage ? (
            <Link
              href={doc.prevPage.href}
              className="group p-4 border-2 border-black dark:border-white bg-white dark:bg-[#181920] shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000] dark:hover:shadow-[5px_5px_0px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-black mb-1 uppercase">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" strokeWidth={3} />
                <span>&lt;&lt; PREVIOUS</span>
              </div>
              <div className="text-sm font-black text-black dark:text-white">
                {doc.prevPage.title}
              </div>
            </Link>
          ) : (
            <div />
          )}

          {doc.nextPage && (
            <Link
              href={doc.nextPage.href}
              className="group p-4 border-2 border-black dark:border-white bg-[#FFE600] text-black shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000] dark:hover:shadow-[5px_5px_0px_0px_#fff] text-right active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <div className="flex items-center justify-end gap-1.5 text-xs text-black font-black mb-1 uppercase">
                <span>NEXT &gt;&gt;</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
              </div>
              <div className="text-sm font-black text-black">
                {doc.nextPage.title}
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Right Table of Contents */}
      <TableOfContents items={doc.toc} />
    </>
  );
}

/**
 * Parses markdown code fences, callouts, lists, headings, and tables into clean React components
 */
function renderFormattedContent(rawText: string) {
  // First split by code blocks
  const parts = rawText.split(/(```[\s\S]*?```)/g);

  return parts.map((part, index) => {
    if (part.startsWith('```')) {
      const match = part.match(/^```(\w+)?\n([\s\S]*?)```$/);
      if (match) {
        const lang = match[1] || 'bash';
        const code = match[2].trim();
        return <CodeBlock key={index} code={code} language={lang} />;
      }
    }

    // Callout detection: lines starting with >
    if (part.trim().startsWith('>')) {
      const calloutText = part.replace(/^>\s?/gm, '').trim();
      return (
        <Callout key={index} type="important">
          <p dangerouslySetInnerHTML={{ __html: formatInline(calloutText) }} />
        </Callout>
      );
    }

    // Process normal text blocks: split by double newlines or paragraph blocks
    const blocks = part.split(/\n\s*\n/);

    return (
      <div key={index} className="space-y-3">
        {blocks.map((block, bIdx) => {
          const trimmed = block.trim();
          if (!trimmed) return null;

          // Headings
          if (trimmed.startsWith('### ')) {
            return (
              <h3
                key={bIdx}
                className="text-base sm:text-lg font-black font-mono uppercase text-black dark:text-white mt-6 mb-2 tracking-tight border-l-4 border-[#FFE600] pl-3"
                dangerouslySetInnerHTML={{ __html: formatInline(trimmed.replace(/^###\s+/, '')) }}
              />
            );
          }
          if (trimmed.startsWith('#### ')) {
            return (
              <h4
                key={bIdx}
                className="text-sm font-black font-mono uppercase text-black dark:text-white mt-4 mb-2 tracking-tight"
                dangerouslySetInnerHTML={{ __html: formatInline(trimmed.replace(/^####\s+/, '')) }}
              />
            );
          }

          // Markdown Table
          if (trimmed.startsWith('|') && trimmed.includes('|-')) {
            const lines = trimmed.split('\n').map((l) => l.trim());
            if (lines.length >= 2) {
              const headers = lines[0]
                .split('|')
                .slice(1, -1)
                .map((h) => formatInline(h.trim()));
              const rows = lines
                .slice(2)
                .filter((l) => l.startsWith('|'))
                .map((l) =>
                  l
                    .split('|')
                    .slice(1, -1)
                    .map((c) => formatInline(c.trim()))
                );
              return <MarkdownTable key={bIdx} headers={headers} rows={rows} />;
            }
          }

          // Unordered list
          const lines = trimmed.split('\n');
          const isUnordered = lines.every((l) => l.trim().startsWith('- ') || l.trim().startsWith('* '));
          if (isUnordered && lines.length > 0) {
            return (
              <ul key={bIdx} className="list-square pl-5 my-3 space-y-1.5 text-zinc-800 dark:text-zinc-200">
                {lines.map((l, lIdx) => (
                  <li
                    key={lIdx}
                    dangerouslySetInnerHTML={{
                      __html: formatInline(l.trim().replace(/^[-*]\s+/, '')),
                    }}
                  />
                ))}
              </ul>
            );
          }

          // Ordered list
          const isOrdered = lines.every((l) => /^\d+\.\s+/.test(l.trim()));
          if (isOrdered && lines.length > 0) {
            return (
              <ol key={bIdx} className="list-decimal pl-5 my-3 space-y-1.5 text-zinc-800 dark:text-zinc-200 font-mono text-xs sm:text-sm">
                {lines.map((l, lIdx) => (
                  <li
                    key={lIdx}
                    dangerouslySetInnerHTML={{
                      __html: formatInline(l.trim().replace(/^\d+\.\s+/, '')),
                    }}
                  />
                ))}
              </ol>
            );
          }

          // Standard paragraph
          return (
            <p
              key={bIdx}
              className="leading-relaxed my-2 text-zinc-800 dark:text-zinc-200 font-medium"
              dangerouslySetInnerHTML={{
                __html: formatInline(trimmed),
              }}
            />
          );
        })}
      </div>
    );
  });
}

/**
 * Formats inline bold, code, italics, links, badges, and LaTeX math formulas
 */
function formatInline(str: string): string {
  return str
    // 1. Inline LaTeX Math / formulas ($...$)
    .replace(/\$([^\$]+)\$/g, (_, math) => {
      const clean = math
        .replace(/\\ge\b/g, '≥')
        .replace(/\\le\b/g, '≤')
        .replace(/\\times\b/g, '×')
        .replace(/\\cdot\b/g, '·')
        .replace(/\\dots\b|\\ldots\b/g, '…')
        .replace(/\\text\{([^\}]+)\}/g, '$1')
        .replace(/\\/g, '')
        .trim();
      return `<span class="font-mono font-bold px-1 bg-black/5 dark:bg-white/10 text-black dark:text-white border border-black/30 dark:border-white/30">${clean}</span>`;
    })
    // 2. Markdown Links ([text](url))
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="font-bold underline underline-offset-4 decoration-2 decoration-black dark:decoration-white hover:bg-[#FFE600] hover:text-black transition-colors">$1</a>')
    // 3. Bold text (**...**)
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-black text-black dark:text-white">$1</strong>')
    // 4. Badges
    .replace(/\*Required\*/g, '<span class="inline-flex items-center px-2 py-0.5 font-mono text-[11px] font-black uppercase bg-[#FF3B30] text-white border-2 border-black shadow-[2px_2px_0px_0px_#000]">[REQUIRED]</span>')
    .replace(/\*Optional\*/g, '<span class="inline-flex items-center px-2 py-0.5 font-mono text-[11px] font-black uppercase bg-zinc-200 text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]">[OPTIONAL]</span>')
    // 5. Italics (*...*)
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
    // 6. Inline code (`...`)
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 font-mono text-xs font-bold bg-[#FFE600] text-black border border-black shadow-[1px_1px_0px_0px_#000] dark:border-white dark:shadow-[1px_1px_0px_0px_#fff]">$1</code>');
}
