---
title: "Phase 3 — Dark Mode Foundation"
status: completed
priority: P2
effort: 2h
completed: 2026-03-25
---

# Phase 3 — Dark Mode Foundation

## Overview
Add dark mode toggle and dark variants to layout shells only. Uses Tailwind CSS v4 approach (CSS-based, no config file).

## Key Technical Context
- **Tailwind v4** — no `tailwind.config.ts`, config lives in `src/index.css`
- Dark mode in v4: uses `@custom-variant dark (&:where(.dark, .dark *));` in CSS, then `dark:` classes work
- Current CSS: `color-scheme: light` in `:root`, brand CSS variables defined

---

## Step 1: Enable Dark Mode in Tailwind v4

**File:** `src/index.css`

Add after `@import "tailwindcss";` line:
```css
@custom-variant dark (&:where(.dark, .dark *));
```

Add dark-mode CSS variables alongside existing `:root`:
```css
.dark {
  color-scheme: dark;
  --glass-bg: rgba(30, 30, 30, 0.7);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  --shadow-soft: 0 2px 12px rgba(0, 0, 0, 0.2);
  --shadow-medium: 0 4px 20px rgba(0, 0, 0, 0.3);
  --shadow-glow: 0 0 20px rgba(247, 98, 38, 0.35);
}
```

Brand colors (`--brand-primary`, etc.) stay same in dark mode — orange works on dark backgrounds.

---

## Step 2: Create Dark Mode Hook

**New file:** `src/hooks/use-dark-mode.ts`

```ts
import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggle = () => setIsDark(prev => !prev);
  return { isDark, toggle };
}
```

---

## Step 3: Add Toggle Button to Sidebar

**File:** `src/components/Sidebar.tsx`

1. Import `useDarkMode` hook and `Sun`, `Moon` icons from lucide-react
2. Add toggle button near bottom of sidebar (above user profile area)
3. Button style:
   ```tsx
   <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title={isDark ? 'Light mode' : 'Dark mode'}>
     {isDark ? <Sun size={20} /> : <Moon size={20} />}
   </button>
   ```

---

## Step 4: Add Dark Variants to Layout Shells

Scope: only top-level containers. Do NOT deep-dive every sub-component.

### `src/App.tsx`
- Root wrapper: add `dark:bg-gray-950 dark:text-gray-100`
- Toast container: add `dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700`

### `src/components/Sidebar.tsx`
- Sidebar container: add `dark:bg-gray-900 dark:border-gray-800`
- Nav links: add `dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white`
- Active link: add `dark:bg-orange-900/20 dark:text-orange-400`
- User profile section: add `dark:bg-gray-800/50`

### `src/components/app-screen-router.tsx` (or main content wrapper)
- Content area wrapper: add `dark:bg-gray-950`

### `src/components/Dashboard.tsx`
- Top-level container: add `dark:bg-gray-950 dark:text-gray-100`
- Card containers: add `dark:bg-gray-900 dark:border-gray-800`
- Section headers: add `dark:text-gray-100`

### Content areas strategy
For article content and other deep components — rely on CSS variables already overridden in `.dark` class (Step 1). Components using `var(--glass-bg)` etc. auto-adapt. Add explicit `dark:` classes to these components in a future phase.

---

## Related Code Files
- `src/index.css` — dark variant + CSS variables
- `src/hooks/use-dark-mode.ts` — new file
- `src/components/Sidebar.tsx` — toggle button + dark classes
- `src/App.tsx` — dark classes on root
- `src/components/app-screen-router.tsx` — dark classes on content wrapper
- `src/components/Dashboard.tsx` — dark classes on dashboard containers

## Todo
- [x] Add `@custom-variant dark` and `.dark` CSS variables to `index.css`
- [x] Create `src/hooks/use-dark-mode.ts`
- [x] Add toggle button to Sidebar
- [x] Add `dark:` variants to App.tsx root wrapper
- [x] Add `dark:` variants to Sidebar.tsx
- [x] Add `dark:` variants to app-screen-router.tsx wrapper
- [x] Add `dark:` variants to Dashboard.tsx containers
- [x] Run `tsc --noEmit` to verify no compile errors
- [x] Visual check: toggle works, layout shells switch correctly, no white flashes

## Success Criteria
- Dark mode toggle in sidebar persists preference to localStorage
- Respects system preference on first visit
- Sidebar, App shell, Dashboard containers render dark backgrounds
- Brand orange accent colors remain vibrant in dark mode
- No white-flash on page load when dark mode is saved
- Zero TypeScript errors

## Risk Assessment
- **Flash of unstyled content (FOUC):** localStorage read is synchronous in the hook initializer, but React hydration may flash. Mitigation: add inline `<script>` in `index.html` to set `.dark` class before React mounts
- **CSS variable conflicts:** some components may hardcode white backgrounds via Tailwind classes (`bg-white`). These won't auto-adapt — acceptable for Phase 3 scope, fix in future phase
- **Third-party components:** TipTap editor, ui-kit may need separate dark mode handling — out of scope for this phase
