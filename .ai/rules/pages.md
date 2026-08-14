---
paths:
  - resources/js/pages/dashboard.tsx
  - resources/js/pages/welcome.tsx
---

# Pages

## Dashboard tabs and role-based member lists
Dashboard is a single role-aware Inertia page (DashboardController) with tabs: 'Profil Saya' (all), 'Kelola Anggota' (admin+owner; owner also sees admins), 'Pengaturan Situs' (admin+owner). Use usePage() hooks before any early return. Member edit + profile + settings forms use useForm; the edit form is remounted via key={selected.id} so initial data refreshes per row.

## Welcome page: streaming-style hero, guest/member split
The welcome page (route 'home') opens with a full-bleed dark hero: background = `/images/slide1.jpg` (a seeded photo — never delete/replace it; it was mistakenly `/images/slide.jpg` which does not exist) under a gradient overlay, always dark in both themes. The decorative `<img>` and the gradient overlay div are both `pointer-events-none` so they never swallow clicks. The Navbar uses its `overlay` prop (transparent, light text/borders) and is now a `sticky top-0 z-50` wrapper rendered INSIDE the hero section — the hero `<section>` must NOT have `overflow-hidden` (it breaks `position: sticky`), so the navbar floats while the hero is on screen. Other pages keep the default solid-background navbar. Hero content is left-aligned and branches on auth.user in React (welcome.tsx):
- Guest (auth.user === null): the whole landing is a single fixed 100vh screen — outer container `h-svh overflow-hidden` (`flex-col`), section `flex-1`, no page scroll. Huge bold "Komunitas Terjocore" + fixed Indonesian subtitle + a prominent "Login / Masuk" button; the footer line is pinned inside the hero bottom (`absolute inset-x-0 bottom-6`, pointer-events-none). NO search icon, slideshow, RULES, or directory (the `members` prop is not passed, so Navbar hides its search button). HomeController still sends `slideshows`/`heroTitle`/`heroSubtitle` to everyone; React just does not render them for guests. The guest navbar right side is `AccountDropdown` (Account / Sign In / Sign Up / Language, English labels, `preferred-language` localStorage key shared with members) + ThemeToggle + (no search).
- Member: hero shows settings-driven `heroTitle`/`heroSubtitle` + the RULES!!! button + member count; the slideshow and member directory render below (still gated on status === 'approved'; pending users are quarantined by EnsureApprovedUser so any member on home is approved). The old inline directory search input was removed — member search is now the search icon + SearchModal fed by the `members` prop. Member page stays `min-h-screen` and scrollable with a standalone footer.

## Login redirects back to the home page
AuthenticatedSessionController::store returns `redirect()->route('home')` — NOT /dashboard. The `guest` middleware alias is the app-level `App\Http\Middleware\RedirectIfAuthenticated` (subclasses the framework one, whose defaultRedirectUri prefers `dashboard` over `home`), so authenticated users hitting /login also bounce to home. Pending users still end up on /pending because EnsureApprovedUser intercepts `/`. AuthTest asserts both redirects.

## Member directory is member-only privacy gate
Card clicks navigate to members.show (Wikipedia-style member detail). Because the destructured prop is named `members`, the route helper must be imported as `memberRoutes from '@/routes/members'` to avoid shadowing.
