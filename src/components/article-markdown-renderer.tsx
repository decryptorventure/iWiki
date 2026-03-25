// Shared markdown-to-JSX renderer used by ArticleModal and ArticleFullView
import React from 'react';

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={i} className="px-1.5 py-0.5 bg-gray-100 text-orange-600 rounded text-sm font-mono">{part.slice(1, -1)}</code>;
    return part;
  });
}

export default function ArticleMarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="prose prose-orange max-w-none text-gray-800 leading-relaxed font-sans selection:bg-orange-100">
      {lines.map((line, i) => {
        if (line.startsWith('# ')) return <h1 key={i} className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-10 mb-6 tracking-tight leading-tight">{line.slice(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-4 border-b border-gray-100 pb-2">{line.slice(3)}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-semibold text-gray-900 mt-4 mb-2">{line.slice(4)}</h3>;
        if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-4 text-gray-700 mb-1">{renderInline(line.slice(2))}</li>;
        if (line.match(/^\d+\. /)) return <li key={i} className="ml-4 list-decimal text-gray-700 mb-1">{renderInline(line.replace(/^\d+\. /, ''))}</li>;
        if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-[#f76226] pl-4 italic text-gray-600 my-3">{line.slice(2)}</blockquote>;
        if (line.startsWith('```') || line === '') return <br key={i} />;
        const imgMatch = line.match(/^!\[([^\]]*)\]\((https?:\/\/[^)]+)\)$/);
        if (imgMatch) return (
          <figure key={i} className="my-4">
            <img src={imgMatch[2]} alt={imgMatch[1] || ''} className="rounded-xl w-full object-cover max-h-[380px] shadow border border-gray-100" loading="lazy" />
            <figcaption className="text-xs text-gray-500 mt-1 text-center">{imgMatch[1] || ''}</figcaption>
          </figure>
        );
        if (line.startsWith('| ')) {
          const cells = line.split('|').filter(c => c.trim());
          if (line.includes('---')) return null;
          return (
            <div key={i} className="overflow-x-auto my-4 rounded-xl border border-gray-100">
              <table className="w-full text-sm text-left">
                <tbody>
                  <tr className="bg-gray-50/50">
                    {cells.map((c, j) => <td key={j} className="px-4 py-2.5 font-medium text-gray-700 border-r border-gray-100 last:border-r-0">{c.trim()}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          );
        }
        return <p key={i} className="mb-3 text-gray-700">{renderInline(line)}</p>;
      })}
    </div>
  );
}
