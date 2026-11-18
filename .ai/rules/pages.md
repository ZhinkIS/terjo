---
paths:
  - resources/js/pages/dashboard.tsx
  - resources/js/pages/welcome.tsx
---

# Pages

## Dashboard tabs and role-based member lists
Dashboard is a single role-aware Inertia page (DashboardController) with tabs: 'Profil Saya' (all), 'Kelola Anggota' (admin+owner; owner also sees admins), 'Pengaturan Situs' (admin+owner). Use usePage() hooks before any early return. Member edit + profile + settings forms use useForm; the edit form is remounted via key={selected.id} so initial data refreshes per row.

## Welcome page: layered hero, guest/member split
The welcome page (route 'home') uses the global adaptive neumorphic surface (`bg-[var(--neu-bg)]`, `text-[var(--neu-ink)]`) in both light and dark themes — no dark gradient or hard borders. Decorative art and sparkles are `pointer-events-none` at `z-0`; content is `z-10`, the marquee `z-20`, and the navbar `z-50`. The Navbar uses the `pill` prop (`rounded-full bg-[var(--neu-bg)] neu-raised`) and renders OUTSIDE the hero section; the section's `overflow-hidden` clips the rotated marquee without breaking the sticky navbar. Marquee/float keyframes live in `resources/css/app.css`. Art is referenced from `/images/` with graceful fallbacks (`hideBrokenImage`, `fallbackToLogo`), so missing decorative files do not render broken icons. Hero content branches on auth.user in React (welcome.tsx):
- Guest (auth.user === null): no slideshow or directory; the `members` prop is not passed, so Navbar hides search. CTA uses `hero.loginButton` and links to `login`. The hero is `min-h-svh` and may scroll on small screens (the stacked mascot/typography needs it); the copyright sits above the marquee. HomeController still sends `slideshows`/`heroTitle`/`heroSubtitle` to everyone; React does not render the member sections for guests.
- Member: hero shows settings-driven `heroTitle` + `heroSubtitle` + the RULES!!! button + member count; the slideshow and member directory render below (still gated on status === 'approved'; pending users are quarantined by EnsureApprovedUser so any member on home is approved). Member search is the Navbar search icon + SearchModal fed by the `members` prop. The page scrolls with a standalone footer.

## Login redirects back to the home page
AuthenticatedSessionController::store returns `redirect()->route('home')` — NOT /dashboard. The `guest` middleware alias is the app-level `App\Http\Middleware\RedirectIfAuthenticated` (subclasses the framework one, whose defaultRedirectUri prefers `dashboard` over `home`), so authenticated users hitting /login also bounce to home. Pending users still end up on /pending because EnsureApprovedUser intercepts `/`. AuthTest asserts both redirects.

## Member directory is member-only privacy gate
Card clicks navigate to members.show (Wikipedia-style member detail). Because the destructured prop is named `members`, the route helper must be imported as `memberRoutes from '@/routes/members'` to avoid shadowing.
