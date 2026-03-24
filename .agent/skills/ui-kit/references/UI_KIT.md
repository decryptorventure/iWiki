We use `@frontend-team/ui-kit` for all UI. Before writing any UI code:
1. Read `UI_KIT.md` in `.agents/skills/ui-kit/` for all available components and their APIs.
2. ALWAYS import from `@frontend-team/ui-kit` (not sub-paths).
3. ALWAYS use design token classes (`bg_primary`, `text_secondary`, etc.) — never raw Tailwind colors.
4. Do NOT install or use shadcn, MUI, Ant Design or other UI libs — use our kit only.

# @frontend-team/ui-kit — LLMs Reference

> Package: @frontend-team/ui-kit | React 18-19 | TypeScript | Tailwind CSS v4
> Docs: https://ui.ikameglobal.com
> Version: 1.0.0

## Quick Start

Install:
  npm install @frontend-team/ui-kit

Import CSS once at your app entry:
  import "@frontend-team/ui-kit/style.css"

Wrap your app root with providers:
  import { TooltipProvider, Toaster } from "@frontend-team/ui-kit"

  function App() {
    return (
      <TooltipProvider>
        <YourApp />
        <Toaster />
      </TooltipProvider>
    )
  }

Important: This library uses Tailwind CSS v4 design tokens internally.
You do NOT need to install Tailwind in your consuming project.

## Components

For detailed usage, fetch the corresponding docs URL:

- Button: https://ui.ikameglobal.com/component-docs/button.md
- Input: https://ui.ikameglobal.com/component-docs/input.md
- Textarea: https://ui.ikameglobal.com/component-docs/textarea.md
- Select: https://ui.ikameglobal.com/component-docs/select.md
- FileUpload: https://ui.ikameglobal.com/component-docs/file-upload.md
- Badge: https://ui.ikameglobal.com/component-docs/badge.md
- Avatar: https://ui.ikameglobal.com/component-docs/avatar.md
- Checkbox: https://ui.ikameglobal.com/component-docs/checkbox.md
- Switch: https://ui.ikameglobal.com/component-docs/switch.md
- RadioGroup: https://ui.ikameglobal.com/component-docs/radio-group.md
- Modal: https://ui.ikameglobal.com/component-docs/modal.md
- Drawer: https://ui.ikameglobal.com/component-docs/drawer.md
- Tooltip: https://ui.ikameglobal.com/component-docs/tooltip.md
- Popover: https://ui.ikameglobal.com/component-docs/popover.md
- DropdownMenu: https://ui.ikameglobal.com/component-docs/dropdown-menu.md
- Tabs: https://ui.ikameglobal.com/component-docs/tabs.md
- Accordion: https://ui.ikameglobal.com/component-docs/accordion.md
- Alert: https://ui.ikameglobal.com/component-docs/alert.md
- Card: https://ui.ikameglobal.com/component-docs/card.md
- Breadcrumb: https://ui.ikameglobal.com/component-docs/breadcrumb.md
- Progress: https://ui.ikameglobal.com/component-docs/progress.md
- Spinner: https://ui.ikameglobal.com/component-docs/spinner.md
- Skeleton: https://ui.ikameglobal.com/component-docs/skeleton.md
- Pagination: https://ui.ikameglobal.com/component-docs/pagination.md
- Steps: https://ui.ikameglobal.com/component-docs/steps.md
- SegmentedControl: https://ui.ikameglobal.com/component-docs/segmented-control.md
- Slider: https://ui.ikameglobal.com/component-docs/slider.md
- Calendar: https://ui.ikameglobal.com/component-docs/calendar.md
- DatePicker: https://ui.ikameglobal.com/component-docs/date-picker.md
- DateRangePicker: https://ui.ikameglobal.com/component-docs/date-range-picker.md
- ScrollArea: https://ui.ikameglobal.com/component-docs/scroll-area.md
- VirtualList: https://ui.ikameglobal.com/component-docs/virtual-list.md
- Toast: https://ui.ikameglobal.com/component-docs/toast.md
- Sidebar: https://ui.ikameglobal.com/component-docs/sidebar.md
- SimpleSidebar: https://ui.ikameglobal.com/component-docs/simple-sidebar.md
- Table: https://ui.ikameglobal.com/component-docs/table.md
- AdvancedTable: https://ui.ikameglobal.com/component-docs/advanced-table.md

## Text Editors (Template-based via @frontend-team/tiptap-kit)

These editors are scaffolded into your project via CLI, not imported from ui-kit directly.

Install:
  npm install @frontend-team/tiptap-kit

Import CSS once at your app entry:
  import "@frontend-team/tiptap-kit/styles.css"

Available editors:

- SimpleEditor (scaffold: npx tiptap-kit add simple)
  A lightweight rich text editor for forms, comment boxes, and short content.
  Docs: https://ui.ikameglobal.com/component-docs/tiptap-simple-editor.md

- NotionEditor (scaffold: npx tiptap-kit add notion-like)
  A full-featured document editor inspired by Notion/Confluence with slash commands, tables, emoji, mentions, drag handles, math, AI menu, and more.
  Docs: https://ui.ikameglobal.com/component-docs/tiptap-notion-editor.md

## Critical Rules

- Import from package root: import { Button } from "@frontend-team/ui-kit"
- Import CSS once: import "@frontend-team/ui-kit/style.css"
- Wrap app in TooltipProvider (required for Tooltip, Popover, DropdownMenu, etc.)
- Add <Toaster /> at app root for toast notifications
- Icon-only Button MUST have aria-label
- Do NOT install Tailwind in consuming projects — this library handles its own styles
- React 18 and 19 compatible, TypeScript-first