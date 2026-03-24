import { ThemeToggle } from "./notion-like-editor-theme-toggle"

// --- Tiptap UI ---
import { UndoRedoButton } from "@frontend-team/tiptap-kit/components/tiptap-ui/undo-redo-button"

// --- UI Primitives ---
import { Spacer } from "@frontend-team/tiptap-kit/components/tiptap-ui-primitive/spacer"
import { Separator } from "@frontend-team/tiptap-kit/components/tiptap-ui-primitive/separator"
import { ButtonGroup } from "@frontend-team/tiptap-kit/components/tiptap-ui-primitive/button"

// --- Styles ---
import "./notion-like-editor-header.css"

import { CollaborationUsers } from "./notion-like-editor-collaboration-users"

export function NotionEditorHeader() {
  return (
    <header className="notion-like-editor-header">
      <Spacer />
      <div className="notion-like-editor-header-actions">
        <ButtonGroup orientation="horizontal">
          <UndoRedoButton action="undo" />
          <UndoRedoButton action="redo" />
        </ButtonGroup>

        <Separator />

        <ThemeToggle />

        <Separator />

        <CollaborationUsers />
      </div>
    </header>
  )
}
