// Table of Contents sidebar for ArticleFullView — parses headings from markdown content
import React, { useState, useEffect } from 'react';
import { List } from 'lucide-react';

export interface TocItem {
  id: string;
  text: string;
  level: 1 | 2 | 3;
  lineIndex: number;
}

/** Extract heading items from raw markdown content, matching heading-{lineIndex} IDs */
export function extractTocItems(content: string): TocItem[] {
  const items: TocItem[] = [];
  content.split('\n').forEach((line, i) => {
    if (line.startsWith('### ')) items.push({ id: `heading-${i}`, text: line.slice(4), level: 3, lineIndex: i });
    else if (line.startsWith('## ')) items.push({ id: `heading-${i}`, text: line.slice(3), level: 2, lineIndex: i });
    else if (line.startsWith('# ')) items.push({ id: `heading-${i}`, text: line.slice(2), level: 1, lineIndex: i });
  });
  return items;
}

interface ArticleTocProps {
  content: string;
  scrollContainerRef: React.RefObject<HTMLElement>;
}

export function ArticleToc({ content, scrollContainerRef }: ArticleTocProps) {
  const items = extractTocItems(content);
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '');

  useEffect(() => {
    if (!items.length) return;
    const root = scrollContainerRef.current ?? undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost intersecting heading
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { root, rootMargin: '-8% 0px -75% 0px', threshold: 0 }
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items, scrollContainerRef]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  if (!items.length) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
        <List size={13} /> Mục lục
      </h3>
      <nav className="space-y-0.5">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className={`w-full text-left py-1.5 px-2 rounded-lg text-xs transition-all border-l-2 truncate block ${
              item.level === 2 ? 'pl-4' : item.level === 3 ? 'pl-6' : 'pl-2'
            } ${
              activeId === item.id
                ? 'border-orange-500 text-orange-600 font-semibold bg-orange-50/50'
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            {item.text}
          </button>
        ))}
      </nav>
    </div>
  );
}
