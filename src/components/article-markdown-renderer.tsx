// Shared markdown-to-JSX renderer used by ArticleModal and ArticleFullView
import React from 'react';

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="font-bold text-[var(--ds-text-primary)]">{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i} className="italic text-[var(--ds-text-secondary)]">{part.slice(1, -1)}</em>;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={i} className="px-1.5 py-0.5 bg-[var(--ds-bg-secondary)] text-[var(--ds-fg-accent-primary)] rounded text-sm font-mono">{part.slice(1, -1)}</code>;
    return part;
  });
}

export default function ArticleMarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="prose prose-orange max-w-none text-[var(--ds-text-secondary)] leading-relaxed font-sans selection:bg-[var(--ds-bg-accent-primary-subtle)]">
      {lines.map((line, i) => {
        if (line.startsWith('# ')) return <h1 key={i} id={`heading-${i}`} className="text-3xl md:text-4xl font-extrabold text-[var(--ds-text-primary)] mt-10 mb-6 tracking-tight leading-tight">{line.slice(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} id={`heading-${i}`} className="text-xl md:text-2xl font-bold text-[var(--ds-text-primary)] mt-8 mb-4 border-b border-[var(--ds-border-secondary)] pb-2">{line.slice(3)}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} id={`heading-${i}`} className="text-lg font-semibold text-[var(--ds-text-primary)] mt-4 mb-2">{line.slice(4)}</h3>;
        if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-4 text-[var(--ds-text-secondary)] mb-1">{renderInline(line.slice(2))}</li>;
        if (line.match(/^\d+\. /)) return <li key={i} className="ml-4 list-decimal text-[var(--ds-text-secondary)] mb-1">{renderInline(line.replace(/^\d+\. /, ''))}</li>;
        if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-[var(--ds-fg-accent-primary)] pl-4 italic text-[var(--ds-text-secondary)] my-3">{line.slice(2)}</blockquote>;
        if (line.startsWith('```') || line === '') return <br key={i} />;
        const imgMatch = line.match(/^!\[([^\]]*)\]\((https?:\/\/[^)]+)\)$/);
        if (imgMatch) return (
          <figure key={i} className="my-4">
            <img src={imgMatch[2]} alt={imgMatch[1] || ''} className="rounded-xl w-full object-cover max-h-[380px] shadow border border-[var(--ds-border-secondary)]" loading="lazy" />
            <figcaption className="text-xs text-[var(--ds-text-secondary)] mt-1 text-center">{imgMatch[1] || ''}</figcaption>
          </figure>
        );
        if (line.startsWith('| ')) {
          const cells = line.split('|').filter(c => c.trim());
          if (line.includes('---')) return null;
          return (
            <div key={i} className="overflow-x-auto my-4 rounded-xl border border-[var(--ds-border-secondary)]">
              <table className="w-full text-sm text-left">
                <tbody>
                  <tr className="bg-[var(--ds-bg-secondary)]">
                    {cells.map((c, j) => <td key={j} className="px-4 py-2.5 font-medium text-[var(--ds-text-secondary)] border-r border-[var(--ds-border-secondary)] last:border-r-0">{c.trim()}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          );
        }
        return <p key={i} className="mb-3 text-[var(--ds-text-secondary)]">{renderInline(line)}</p>;
      })}
    </div>
  );
}
