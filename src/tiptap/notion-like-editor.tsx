"use client"

import { useContext, useEffect } from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import { createPortal } from "react-dom"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Mention } from "@tiptap/extension-mention"
import { TaskList, TaskItem } from "@tiptap/extension-list"
import { Color, TextStyle } from "@tiptap/extension-text-style"
import { Placeholder, Selection } from "@tiptap/extensions"
import { isChangeOrigin } from "@tiptap/extension-collaboration"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Superscript } from "@tiptap/extension-superscript"
import { Subscript } from "@tiptap/extension-subscript"
import { TextAlign } from "@tiptap/extension-text-align"
import { Mathematics } from "@tiptap/extension-mathematics"
import { UniqueID } from "@tiptap/extension-unique-id"
import { Emoji, gitHubEmojis } from "@tiptap/extension-emoji"

// --- Hooks ---
import { useUiEditorState } from "@frontend-team/tiptap-kit/hooks/use-ui-editor-state"
import { useScrollToHash } from "@frontend-team/tiptap-kit/components/tiptap-ui/copy-anchor-link-button/use-scroll-to-hash"

// --- Custom Extensions ---
import { HorizontalRule } from "@frontend-team/tiptap-kit/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import { UiState } from "@frontend-team/tiptap-kit/components/tiptap-extension/ui-state-extension"
import { Image } from "@frontend-team/tiptap-kit/components/tiptap-node/image-node/image-node-extension"
import { NodeBackground } from "@frontend-team/tiptap-kit/components/tiptap-extension/node-background-extension"
import { NodeAlignment } from "@frontend-team/tiptap-kit/components/tiptap-extension/node-alignment-extension"

// --- Tiptap Node ---
import { ImageUploadNode } from "@frontend-team/tiptap-kit/components/tiptap-node/image-upload-node/image-upload-node-extension"

// --- Table Node ---
import { TableKit } from "@frontend-team/tiptap-kit/components/tiptap-node/table-node/extensions/table-node-extension"
import { TableHandleExtension } from "@frontend-team/tiptap-kit/components/tiptap-node/table-node/extensions/table-handle"
import { TableHandle } from "@frontend-team/tiptap-kit/components/tiptap-node/table-node/ui/table-handle/table-handle"
import { TableSelectionOverlay } from "@frontend-team/tiptap-kit/components/tiptap-node/table-node/ui/table-selection-overlay"
import { TableCellHandleMenu } from "@frontend-team/tiptap-kit/components/tiptap-node/table-node/ui/table-cell-handle-menu"
import { TableExtendRowColumnButtons } from "@frontend-team/tiptap-kit/components/tiptap-node/table-node/ui/table-extend-row-column-button"


// --- Tiptap UI ---
import { EmojiDropdownMenu } from "@frontend-team/tiptap-kit/components/tiptap-ui/emoji-dropdown-menu"
import { MentionDropdownMenu } from "@frontend-team/tiptap-kit/components/tiptap-ui/mention-dropdown-menu"
import { SlashDropdownMenu } from "@frontend-team/tiptap-kit/components/tiptap-ui/slash-dropdown-menu"
import { DragContextMenu } from "@frontend-team/tiptap-kit/components/tiptap-ui/drag-context-menu"
import { AiMenu } from "@frontend-team/tiptap-kit/components/tiptap-ui/ai-menu"

// --- Contexts ---
import { AppProvider } from "@frontend-team/tiptap-kit/contexts/app-context"
import { UserProvider } from "@frontend-team/tiptap-kit/contexts/user-context"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@frontend-team/tiptap-kit/lib/tiptap-utils"

// --- Styles ---
import "./notion-like-editor.css"

// --- Content ---
import { NotionEditorHeader } from "./notion-like-editor-header"
import { MobileToolbar } from "./notion-like-editor-mobile-toolbar"
import { NotionToolbarFloating } from "./notion-like-editor-toolbar-floating"
import { ListNormalizationExtension } from "@frontend-team/tiptap-kit/components/tiptap-extension/list-normalization-extension"

export interface NotionEditorProps {
  room: string
  placeholder?: string
  onChange?: (html: string) => void
}

export interface EditorProviderProps {
  placeholder?: string
  onChange?: (html: string) => void
}

/**
 * Loading spinner component shown while connecting to the notion server
 */
export function LoadingSpinner({ text = "Connecting..." }: { text?: string }) {
  return (
    <div className="spinner-container">
      <div className="spinner-content">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <div className="spinner-loading-text">{text}</div>
      </div>
    </div>
  )
}

/**
 * EditorContent component that renders the actual editor
 */
export function EditorContentArea() {
  const { editor } = useContext(EditorContext)!
  const {
    aiGenerationIsLoading,
    aiGenerationIsSelection,
    aiGenerationHasMessage,
    isDragging,
  } = useUiEditorState(editor)

  // Selection based effect to handle AI generation acceptance
  useEffect(() => {
    if (!editor) return

    const canAccept =
      Boolean((editor.commands as Record<string, unknown>).aiAccept) &&
      Boolean((editor.commands as Record<string, unknown>).resetUiState)

    if (
      canAccept &&
      !aiGenerationIsLoading &&
      aiGenerationIsSelection &&
      aiGenerationHasMessage
    ) {
      ;(editor.chain().focus() as unknown as { aiAccept: () => void }).aiAccept()
      editor.commands.resetUiState?.()
    }
  }, [
    aiGenerationHasMessage,
    aiGenerationIsLoading,
    aiGenerationIsSelection,
    editor,
  ])

  useScrollToHash()

  if (!editor) {
    return null
  }

  return (
    <EditorContent
      editor={editor}
      role="presentation"
      className="notion-like-editor-content"
      style={{
        cursor: isDragging ? "grabbing" : "auto",
      }}
    >
      <DragContextMenu />
      <AiMenu />
      <EmojiDropdownMenu />
      <MentionDropdownMenu />
      <SlashDropdownMenu />
      <NotionToolbarFloating />

      {createPortal(<MobileToolbar />, document.body)}
    </EditorContent>
  )
}

/**
 * Component that creates and provides the editor instance
 */
export function EditorProvider(props: EditorProviderProps) {
  const { placeholder = "Start writing...", onChange } = props

  const editor = useEditor({
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "notion-like-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        dropcursor: {
          width: 2,
        },
        link: { openOnClick: false },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder,
        emptyNodeClass: "is-empty with-slash",
      }),
      Mention,
      Emoji.configure({
        emojis: gitHubEmojis.filter(
          (emoji) => !emoji.name.includes("regional")
        ),
        forceFallbackImages: true,
      }),
      TableKit.configure({
        table: {
          resizable: true,
          cellMinWidth: 120,
        },
      }),
      NodeBackground,
      NodeAlignment,
      TextStyle,
      Mathematics,
      Superscript,
      Subscript,
      Color,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Selection,
      Image,
      TableHandleExtension,
      ListNormalizationExtension,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
      UniqueID.configure({
        types: [
          "table",
          "paragraph",
          "bulletList",
          "orderedList",
          "taskList",
          "heading",
          "blockquote",
          "codeBlock",
        ],
        filterTransaction: (transaction) => !isChangeOrigin(transaction),
      }),
      Typography,
      UiState,
    ],
  })

  if (!editor) {
    return <LoadingSpinner />
  }

  return (
    <div className="notion-like-editor-wrapper">
      <EditorContext.Provider value={{ editor }}>
        <NotionEditorHeader />
        <EditorContentArea />

        <TableExtendRowColumnButtons />
        <TableHandle />
        <TableSelectionOverlay
          showResizeHandles={true}
          cellMenu={(props) => (
            <TableCellHandleMenu
              editor={props.editor}
              onMouseDown={(e) => props.onResizeStart?.("br")(e)}
            />
          )}
        />
      </EditorContext.Provider>

      
    </div>
  )
}

/**
 * Full editor with all necessary providers, ready to use with just a room ID
 */
export function NotionEditor({
  room: _room,
  placeholder = "Start writing...",
  onChange,
}: NotionEditorProps) {
  return (
    <UserProvider>
      <AppProvider>
        <NotionEditorContent placeholder={placeholder} onChange={onChange} />
      </AppProvider>
    </UserProvider>
  )
}

/**
 * Internal component that handles the editor loading state
 */
export function NotionEditorContent({ placeholder, onChange }: { placeholder?: string, onChange?: (html: string) => void }) {
  return <EditorProvider placeholder={placeholder} onChange={onChange} />
}
