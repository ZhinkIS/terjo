---
paths:
  - 'resources/js/**'
---

# Js

## Do not use eager import.meta.glob in app.tsx resolver
The Blade template resolves resources/js/pages/{component}.tsx against public/build/manifest.json. A custom `resolve` using `import.meta.glob(..., { eager: true })` bundles every page into app.js, so per-page manifest entries disappear and tests/prod 500 with "Unable to locate file in Vite manifest". Keep `createInertiaApp` WITHOUT `resolve`/`setup` (use `withApp` to wrap providers) so @inertiajs/vite injects its lazy-glob resolver and emits per-page chunks.

## Micro-interaction: active:scale-95 on every interactive element
All buttons/button-styled links across every page must include `active:scale-95` (or `active:scale-[0.98]` for full-width rows/cards) so presses give visual feedback on mobile. Rely on the existing `transition` class (its default duration is 150ms) — do not swap it for `transition-transform` or the color transitions disappear. Full-screen backdrop buttons (modals) are exempt from scaling.
