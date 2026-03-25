import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Save, Download, Sparkles, X, Bold, Italic, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered, Table,
  Undo2, Redo2, Type, ChevronDown, FileText,
} from 'lucide-react';
import { Button, Input, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@frontend-team/ui-kit';

interface AIDocEditorProps {
  title: string;
  content: string;
  onClose: () => void;
  onSave?: (title: string, content: string) => void;
}

type BlockStyle = 'paragraph' | 'h1' | 'h2' | 'h3';

export default function AIDocEditor({ title: initialTitle, content: initialContent, onClose, onSave }: AIDocEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [html, setHtml] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [blockStyle, setBlockStyle] = useState<BlockStyle>('paragraph');
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHtml(markdownToHtml(initialContent));
  }, [initialContent]);

  useEffect(() => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    const words = text.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
    setCharCount(text.length);
  }, [html]);

  const markdownToHtml = (md: string): string => {
    return md
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/~~([^~]+)~~/g, '<del>$1</del>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      .replace(/^---$/gm, '<hr/>')
      .replace(/\n{2,}/g, '</p><p>')
      .replace(/\n/g, '<br/>')
      .replace(/^(.+)$/gm, (line) => {
        if (line.startsWith('<h') || line.startsWith('<ul') || line.startsWith('<ol') || line.startsWith('<li') || line.startsWith('<hr') || line.startsWith('<p') || line.startsWith('</p')) return line;
        return line;
      });
  };

  const exec = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const handleBlockStyle = (style: BlockStyle) => {
    setBlockStyle(style);
    setShowBlockMenu(false);
    if (style === 'paragraph') exec('formatBlock', 'p');
    else if (style === 'h1') exec('formatBlock', 'h1');
    else if (style === 'h2') exec('formatBlock', 'h2');
    else if (style === 'h3') exec('formatBlock', 'h3');
  };

  const handleSave = () => {
    setIsSaved(true);
    onSave?.(title, editorRef.current?.innerHTML || html);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExport = () => {
    const text = editorRef.current?.innerText || '';
    const blob = new Blob([`# ${title}\n\n${text}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const blockLabels: Record<BlockStyle, string> = {
    paragraph: 'Paragraph',
    h1: 'Heading 1',
    h2: 'Heading 2',
    h3: 'Heading 3',
  };

  const ToolbarButton = ({ icon: Icon, onClick, active, title: btnTitle }: { icon: React.ElementType; onClick: () => void; active?: boolean; title?: string }) => (
    <button
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={btnTitle}
      className={`p-1.5 rounded-lg transition-all duration-150 ${active ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
    >
      <Icon size={16} />
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-[var(--ds-bg-primary)] text-[var(--ds-text-primary)] animate-fade-in">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-5 py-3 border-b border-[var(--ds-border-secondary)] bg-[var(--ds-bg-primary)]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[var(--ds-bg-accent-primary-subtle)] rounded-lg border border-[var(--ds-border-accent-primary-subtle)]">
            <FileText size={16} className="text-[var(--ds-fg-accent-primary)]" />
          </div>
          <Input
            variant="borderless"
            size="s"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent text-sm font-bold text-[var(--ds-text-primary)] outline-none placeholder:text-[var(--ds-text-secondary)] min-w-[200px] border-none shadow-none h-auto p-0"
            placeholder="Tên tài liệu..."
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[var(--ds-text-secondary)] mr-2 tabular-nums">{wordCount} Words, {charCount} characters</span>
          <Button size="s" variant={isSaved ? 'border' : 'primary'} onClick={handleSave} className={isSaved ? 'text-[var(--ds-fg-success)] border-[var(--ds-border-success-subtle)]' : ''}>
            <Save size={13} /> {isSaved ? 'Saved!' : 'Save'}
          </Button>
          <Button size="s" variant="border" onClick={handleExport}>
            <Download size={13} /> Export
          </Button>
          <Button size="s" variant="border" onClick={() => {}}>
            <Sparkles size={13} /> Improve
          </Button>
          <Button size="icon-s" variant="subtle" onClick={onClose} className="ml-1">
            <X size={16} />
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="shrink-0 flex items-center gap-1 px-5 py-2 border-b border-[var(--ds-border-secondary)] bg-[var(--ds-bg-secondary)]">
        <ToolbarButton icon={Undo2} onClick={() => exec('undo')} title="Undo" />
        <ToolbarButton icon={Redo2} onClick={() => exec('redo')} title="Redo" />
        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Block style dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="subtle"
              size="s"
              className="flex items-center gap-1.5 rounded-lg text-xs font-medium text-[var(--ds-text-secondary)] hover:bg-[var(--ds-bg-tertiary)] hover:text-[var(--ds-text-primary)] transition-all border-none shadow-none"
            >
              <Type size={14} />
              {blockLabels[blockStyle]}
              <ChevronDown size={12} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            {(Object.keys(blockLabels) as BlockStyle[]).map((style) => (
              <DropdownMenuItem
                key={style}
                onSelect={() => handleBlockStyle(style)}
                className={`text-xs ${blockStyle === style ? 'text-[var(--ds-fg-accent-primary)] font-bold' : 'text-[var(--ds-text-secondary)]'}`}
              >
                {blockLabels[style]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarButton icon={Sparkles} onClick={() => {}} title="AI Assist" />
        <ToolbarButton icon={Bold} onClick={() => exec('bold')} title="Bold" />
        <ToolbarButton icon={Italic} onClick={() => exec('italic')} title="Italic" />
        <ToolbarButton icon={Strikethrough} onClick={() => exec('strikeThrough')} title="Strikethrough" />
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarButton icon={Heading1} onClick={() => exec('formatBlock', 'h1')} title="Heading 1" />
        <ToolbarButton icon={Heading2} onClick={() => exec('formatBlock', 'h2')} title="Heading 2" />
        <ToolbarButton icon={Heading3} onClick={() => exec('formatBlock', 'h3')} title="Heading 3" />
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarButton icon={List} onClick={() => exec('insertUnorderedList')} title="Bullet List" />
        <ToolbarButton icon={ListOrdered} onClick={() => exec('insertOrderedList')} title="Numbered List" />
        <ToolbarButton icon={Table} onClick={() => exec('insertHTML', '<table class="w-full border border-[var(--ds-border-secondary)] my-2"><tr><td class="border border-[var(--ds-border-secondary)] p-2">Cell</td><td class="border border-[var(--ds-border-secondary)] p-2">Cell</td></tr></table>')} title="Table" />
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto px-12 py-10">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="ai-doc-editor min-h-[500px] outline-none text-[15px] leading-relaxed text-[var(--ds-text-secondary)]"
            dangerouslySetInnerHTML={{ __html: html }}
            onInput={() => {
              const text = editorRef.current?.innerText || '';
              const words = text.trim().split(/\s+/).filter(Boolean);
              setWordCount(words.length);
              setCharCount(text.length);
            }}
          />
        </div>
      </div>
    </div>
  );
}
