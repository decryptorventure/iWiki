import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Save, Download, Sparkles, X, Bold, Italic, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered, Table,
  Undo2, Redo2, Type, ChevronDown, FileText,
} from 'lucide-react';

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
    <div className="flex flex-col h-full bg-white text-gray-900 animate-fade-in">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-orange-50 rounded-lg border border-orange-100">
            <FileText size={16} className="text-[#FF6B4A]" />
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent text-sm font-bold text-gray-900 outline-none placeholder:text-gray-400 min-w-[200px]"
            placeholder="Tên tài liệu..."
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-500 mr-2 tabular-nums">{wordCount} Words, {charCount} characters</span>
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isSaved ? 'bg-green-500/20 text-green-400' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
          >
            <Save size={13} /> {isSaved ? 'Saved!' : 'Save'}
          </button>
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">
            <Download size={13} /> Export
          </button>
          <button onClick={() => {}} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">
            <Sparkles size={13} /> Improve
          </button>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all ml-1">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="shrink-0 flex items-center gap-1 px-5 py-2 border-b border-gray-200 bg-gray-50">
        <ToolbarButton icon={Undo2} onClick={() => exec('undo')} title="Undo" />
        <ToolbarButton icon={Redo2} onClick={() => exec('redo')} title="Redo" />
        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Block style dropdown */}
        <div className="relative">
          <button
            onMouseDown={(e) => { e.preventDefault(); setShowBlockMenu(!showBlockMenu); }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
          >
            <Type size={14} />
            {blockLabels[blockStyle]}
            <ChevronDown size={12} />
          </button>
          {showBlockMenu && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 py-1 overflow-hidden">
              {(Object.keys(blockLabels) as BlockStyle[]).map((style) => (
                <button
                  key={style}
                  onMouseDown={(e) => { e.preventDefault(); handleBlockStyle(style); }}
                  className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 transition-colors ${blockStyle === style ? 'text-[#FF6B4A] font-bold' : 'text-gray-600'}`}
                >
                  {blockLabels[style]}
                </button>
              ))}
            </div>
          )}
        </div>
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
        <ToolbarButton icon={Table} onClick={() => exec('insertHTML', '<table class="w-full border border-gray-200 my-2"><tr><td class="border border-gray-200 p-2">Cell</td><td class="border border-gray-200 p-2">Cell</td></tr></table>')} title="Table" />
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto px-12 py-10">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="ai-doc-editor min-h-[500px] outline-none text-[15px] leading-relaxed text-gray-800"
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
