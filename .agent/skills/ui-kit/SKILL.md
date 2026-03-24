# iKame UI Kit — Design System Skill

## Description
Enforces iKame's design system using `@frontend-team/ui-kit` for all UI development. This skill ensures all AI-generated code follows the company's design tokens, component library, and coding standards.

## When to activate
- Any task involving UI code, component creation, or frontend development
- When the user asks to create, modify, or refine any visual interface
- When vibe coding screens, pages, or components for My iKame or any iKame project

## Instructions

### Critical Rules (NEVER violate)
1. **ALWAYS** import components from `@frontend-team/ui-kit` — never from sub-paths
2. **ALWAYS** use design token classes (`bg_primary`, `text_secondary`, etc.) — never raw Tailwind colors like `bg-blue-500`
3. **NEVER** install or use shadcn/ui, MUI, Ant Design, Chakra UI, or any other UI library
4. **NEVER** install Tailwind CSS in the consuming project — ui-kit handles its own styles
5. **ALWAYS** wrap app root with `<TooltipProvider>` and include `<Toaster />`
6. Icon-only `<Button>` **MUST** have `aria-label`

### Setup Requirements
- Import CSS once at app entry: `import "@frontend-team/ui-kit/style.css"`
- For rich text editors: `import "@frontend-team/tiptap-kit/styles.css"`

### Component Selection Priority
Before creating custom components, check if `@frontend-team/ui-kit` already provides one.
Refer to `references/UI_KIT.md` for the full list of 35+ available components.

### Code Style
- React 18/19 compatible, TypeScript-first
- Use functional components with hooks
- Prefer composition of ui-kit components over custom implementations

## Resources
- references/UI_KIT.md — Full component list, APIs, and usage instructions