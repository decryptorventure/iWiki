# iWiki - Design Guidelines

**Document Version**: 1.0
**Last Updated**: 2026-03-25
**Status**: Active
**Owner**: Engineering Team

---

## 1. UI Component Library

All interactive UI elements use **@frontend-team/ui-kit v1.1.1** (vendored in `libs/ui-kit-1.1.1.tgz`).

### 1.1 Button Component

**Variants:**
- `primary` - Call-to-action buttons (save, publish, create)
- `secondary` - Alternative actions
- `dim` - De-emphasized actions
- `border` - Outlined style
- `subtle` - Minimal style (ideal for icon buttons)
- `danger` - Destructive actions (delete, reject)

**Sizes:**
- `xs`, `s`, `m`, `l`, `xl` - Text buttons
- `icon-xs`, `icon-s`, `icon-m`, `icon-l`, `icon-xl` - Icon-only buttons

**Usage Examples:**
```typescript
import { Button } from '@frontend-team/ui-kit';

// Primary action
<Button variant="primary" size="m">Save Article</Button>

// Icon button
<Button variant="subtle" size="icon-m"><X size={20} /></Button>

// Destructive action
<Button variant="danger" size="s">Delete</Button>

// Border style
<Button variant="border" size="s">Cancel</Button>
```

### 1.2 Input Component

Text input fields with integrated error and disabled states.

**Usage:**
```typescript
import { Input } from '@frontend-team/ui-kit';

<Input
  placeholder="Search articles..."
  value={query}
  onChange={(e) => setQuery(e.target.value)}
/>

<Input
  placeholder="Email"
  disabled
/>
```

### 1.3 Textarea Component

Multi-line text input for comments, descriptions, and rich content preview.

**Usage:**
```typescript
import { Textarea } from '@frontend-team/ui-kit';

<Textarea
  placeholder="Write your comment..."
  value={comment}
  onChange={(e) => setComment(e.target.value)}
  rows={4}
/>
```

### 1.4 Modal Component

Dialog wrapper with configurable title, footer, and size.

**Props:**
- `open: boolean` - Controls visibility
- `onOpenChange: (open: boolean) => void` - Close handler
- `title?: string` - Modal heading
- `size?: 's' | 'm' | 'l'` - Modal width
- `footer?: React.ReactNode` - Footer buttons/actions

**Usage:**
```typescript
import { Modal, Button } from '@frontend-team/ui-kit';

<Modal
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Create Bounty"
  size="m"
  footer={
    <Button variant="primary" onClick={handleCreate}>
      Create
    </Button>
  }
>
  <Input placeholder="Title" />
  <Textarea placeholder="Description" />
</Modal>
```

### 1.5 Select Component

Dropdown selection for forms and filters.

**Usage:**
```typescript
import { Select } from '@frontend-team/ui-kit';

<Select
  value={selectedFolder}
  onChange={setSelectedFolder}
  options={folderList}
  placeholder="Choose folder..."
/>
```

---

## 2. Component Usage Across iWiki

### 2.1 Affected Components (20+)

All these components use ui-kit:
- Editor, Dashboard, Bounties, Profile, ArticleModal, ArticleFullView
- AdminDashboard, ManagerDashboard, PermissionManagement, DocumentManagement
- DataJanitor, MyArticles, FolderView, Notifications, SearchResult
- Modals: EditorPublishModal, EditorTemplateModal, DocumentPermissionModal
- Sub-components: dashboard-*, editor-*, iwiki-ai-*, permission-*, article-*

### 2.2 Raw HTML Elements (Exceptions)

Raw buttons/inputs are only kept in these cases:

**Navigation Items**
- Sidebar navigation links use custom `<a>` tag styling
- NavItem pattern with conditional active states

**Tiptap Editor Toolbar**
- Formatting buttons (bold, italic, heading) use inline button styles
- Toolbar buttons preserve raw HTML for Tiptap integration

**AI Chat Textarea**
- Chat input textarea + send button follow textarea send pattern
- Row-based inline layout for mobile responsiveness

### 2.3 Styling Pattern

All components use **Tailwind CSS** for:
- Layout and spacing (mx, py, gap, flex, grid)
- Colors (text-blue-600, bg-red-50, border-gray-300)
- Typography (font-bold, text-sm, leading-tight)
- Responsive utilities (md:, lg:, max-w-*)

ui-kit components are styled internally; avoid duplicating variant logic in parent components.

---

## 3. Color & Typography

### 3.1 Color Palette

| Color | Tailwind Class | Use Case |
|-------|----------------|----------|
| Orange | text-orange-600, bg-orange-50 | Likes, featured (hot) bounties |
| Blue | text-blue-600, bg-blue-50 | Primary actions, links |
| Red | text-red-600, bg-red-50 | Destructive actions, errors |
| Green | text-green-600, bg-green-50 | Success messages, approved status |
| Gray | text-gray-600, bg-gray-50 | Neutral text, disabled states |

### 3.2 Typography

- **Headings**: Use semantic `<h1>` to `<h3>` with `font-bold`
- **Body**: Use `<p>` or `<span>` with default font size
- **Small text**: Use `text-sm` for metadata, timestamps
- **Monospace**: Use `font-mono` for code snippets, IDs

---

## 4. Component Composition Patterns

### 4.1 Modal with Form

```typescript
const [open, setOpen] = useState(false);
const [title, setTitle] = useState('');

return (
  <>
    <Button variant="primary" onClick={() => setOpen(true)}>
      Create Item
    </Button>

    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Create New Item"
      size="m"
      footer={
        <div className="flex gap-2">
          <Button variant="border" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleCreate}>Create</Button>
        </div>
      }
    >
      <Input
        placeholder="Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </Modal>
  </>
);
```

### 4.2 Button Group

```typescript
<div className="flex gap-2">
  <Button variant="primary" size="s">Save</Button>
  <Button variant="border" size="s">Cancel</Button>
  <Button variant="danger" size="s">Delete</Button>
</div>
```

### 4.3 Form with Multiple Inputs

```typescript
<div className="space-y-4">
  <div>
    <label className="block text-sm font-medium mb-1">Title</label>
    <Input placeholder="..." />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Description</label>
    <Textarea rows={4} placeholder="..." />
  </div>

  <Button variant="primary" className="w-full">
    Submit
  </Button>
</div>
```

---

## 5. Responsive Design

### 5.1 Breakpoints

- Mobile: `< 768px` (no prefix)
- Tablet: `md:` (768px+)
- Desktop: `lg:` (1024px+)
- Large: `xl:` (1280px+)

### 5.2 Common Patterns

```typescript
// Stack on mobile, grid on desktop
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
  <div>Left</div>
  <div>Center</div>
  <div>Right</div>
</div>

// Flex direction
<div className="flex flex-col md:flex-row gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// Responsive padding
<div className="px-4 md:px-8 py-6 md:py-12">
  Content
</div>
```

---

## 6. Accessibility

### 6.1 Button Accessibility

- Always provide `aria-label` for icon-only buttons
- Use `title` attribute for tooltips on hover

```typescript
<Button
  variant="subtle"
  size="icon-m"
  title="Close dialog"
  onClick={onClose}
>
  <X size={20} />
</Button>
```

### 6.2 Form Accessibility

- Use `<label>` with `htmlFor` matching input `id`
- Provide error messages linked to input via `aria-describedby`

```typescript
<label htmlFor="title" className="block text-sm font-medium">
  Article Title
</label>
<Input
  id="title"
  placeholder="..."
  aria-describedby="title-error"
/>
<p id="title-error" className="text-red-600 text-sm mt-1">
  Title is required
</p>
```

### 6.3 Modal Accessibility

- Modal automatically traps focus and handles Escape key
- Ensure footer buttons are clearly labeled

---

## 7. Animation & Transitions

Use **Motion** (Framer Motion) for smooth animations:

```typescript
import { motion } from 'motion/react';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

---

## 8. Icons

All icons use **Lucide React** (lucide-react v0.546.0):

```typescript
import { Heart, Share2, Bookmark, X, ChevronDown } from 'lucide-react';

<Button variant="subtle" size="icon-m" title="Like">
  <Heart size={20} />
</Button>
```

---

## 9. Common Anti-Patterns

### ❌ Don't:
- Mix raw HTML buttons with ui-kit buttons
- Create custom variants for Button (use existing ones)
- Use generic `<div>` instead of semantic elements
- Add custom button CSS when ui-kit has a variant
- Use inline `style=` for layout (use Tailwind classes)

### ✅ Do:
- Use ui-kit components for all interactive elements
- Combine variants with Tailwind classes for spacing/sizing
- Use semantic HTML (`<button>`, `<input>`, `<label>`)
- Leverage ui-kit props over custom styling
- Keep components self-contained and composable

---

## Related Documents

- [Codebase Summary](./codebase-summary.md) - Component catalog
- [Code Standards](./code-standards.md) - Coding conventions
- [System Architecture](./system-architecture.md) - Technical stack

---

**Document End**
