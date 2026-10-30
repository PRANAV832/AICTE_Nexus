# AICTE NEXUS

React + Vite + Tailwind CSS application for AICTE NEXUS (Next-Generation Regulatory Intelligence & Unified Approval System).

## Development Server

Start the local Vite development server:

`pnpm dev`

- Local URL: http://localhost:5173
- Hot reload: Changes to source files are reflected immediately

## Project Structure

- `src/main.tsx` - React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into the `#root` element
- `src/App.tsx` - Application component root re-exporting `src/app/App.tsx`
- `src/app/App.tsx` - RouterProvider mounting the application routes
- `src/app/routes.tsx` - Application routes and module definitions
- `src/components/AppShell.tsx` - Shell layout with sidebar, navigation, role switcher, and topbar
- `src/components/ui.tsx` - Shared UI components (badges, buttons, cards, modals, toast)
- `src/pages/CommandCenter.tsx` - Regulatory Command Center dashboard
- `src/pages/Applications.tsx` - Applications registry with filters, search, and pagination
- `src/pages/ApplicationDetail.tsx` - Comprehensive application profile and review workbench
- `src/pages/IntelligencePages.tsx` - AI Copilot, Risk Intelligence, Digital Twin, Document Intelligence, and Simulator
- `src/pages/ModulePage.tsx` - Generic regulatory modules (EVC, Scrutiny, Undertakings, Compliance, etc.)
- `src/data/mockData.ts` - Comprehensive fictional institutions and application records
- `src/types.ts` - TypeScript interfaces and types
- `src/index.css` - Global CSS styling and design system tokens
- `index.html` - Vite HTML shell
- `package.json` - Dependencies and build scripts
- `vite.config.ts` - Clean Vite configuration with React and Tailwind CSS v4

## Dependencies

- Runtime: React 19 and React DOM 19
- Routing: React Router 7
- Icons: Lucide React
- Charts: Recharts
- Styling: Tailwind CSS v4 with the `@tailwindcss/vite` plugin
- Build tooling: Vite 8, TypeScript 5.7, and `@vitejs/plugin-react`
- Formatting: oxfmt

## Styling

This project uses **Tailwind CSS v4** through the `@tailwindcss/vite` plugin configured in `vite.config.ts`. `src/index.css` imports Tailwind with `@import 'tailwindcss';`. Use Tailwind utility classes directly in JSX and put global CSS or Tailwind v4 theme customization in `src/index.css`. This scaffold does not need a Tailwind config file or PostCSS config.

`src/main.tsx` imports `src/index.css`, so global font wiring belongs in `src/index.css`. Keep CSS `@import` statements first, then add any `@font-face` rules and font-family defaults there.

Tailwind emits utility classes in `@layer utilities`, and CSS outside any cascade layer overrides every layer regardless of specificity. Put global element styles, such as resets and defaults for `body`, headings, `button`, or `input`, inside `@layer base { ... }` so utility classes on those elements still apply.
