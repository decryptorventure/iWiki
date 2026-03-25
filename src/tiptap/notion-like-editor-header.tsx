// Fixed formatting toolbar for the Notion-like editor
import { UndoRedoButton } from "@frontend-team/tiptap-kit/components/tiptap-ui/undo-redo-button"
import { TurnIntoDropdown } from "@frontend-team/tiptap-kit/components/tiptap-ui/turn-into-dropdown"
import { ImproveDropdown } from "@frontend-team/tiptap-kit/components/tiptap-ui/improve-dropdown"
import { MarkButton } from "@frontend-team/tiptap-kit/components/tiptap-ui/mark-button"
import { HeadingButton } from "@frontend-team/tiptap-kit/components/tiptap-ui/heading-button"
import { ListButton } from "@frontend-team/tiptap-kit/components/tiptap-ui/list-button"
import { Separator } from "@frontend-team/tiptap-kit/components/tiptap-ui-primitive/separator"
import { ButtonGroup } from "@frontend-team/tiptap-kit/components/tiptap-ui-primitive/button"
import { CollaborationUsers } from "./notion-like-editor-collaboration-users"
import "./notion-like-editor-header.css"

export function NotionEditorHeader() {
  return (
    <header className="notion-like-editor-header notion-like-editor-header--fixed">
      {/* Undo / Redo */}
      <ButtonGroup orientation="horizontal">
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ButtonGroup>

      <Separator />

      {/* Block type */}
      <TurnIntoDropdown />

      <Separator />

      {/* AI improve */}
      <ImproveDropdown />

      <Separator />

      {/* Inline marks */}
      <ButtonGroup orientation="horizontal">
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
      </ButtonGroup>

      <Separator />

      {/* Headings */}
      <ButtonGroup orientation="horizontal">
        <HeadingButton level={1} />
        <HeadingButton level={2} />
        <HeadingButton level={3} />
      </ButtonGroup>

      <Separator />

      {/* Lists */}
      <ButtonGroup orientation="horizontal">
        <ListButton type="bulletList" />
        <ListButton type="orderedList" />
      </ButtonGroup>

      <Separator />

      <CollaborationUsers />
    </header>
  )
}
