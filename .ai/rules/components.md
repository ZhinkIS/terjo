---
paths:
  - resources/js/components/navbar.tsx
---

# Components

## Mobile menu drops below the sticky navbar; desktop nav is hidden md:flex
The navbar is a sticky wrapper (`sticky top-0 z-50`), solid background by default and transparent via the `overlay` prop for the welcome hero. The hamburger (md:hidden) opens mobile-menu.tsx, which is ALWAYS mounted and toggles Tailwind classes (opacity/translate) so it fades/slides — the panel is `absolute inset-x-0 top-full` right below the navbar and the backdrop is `bg-black/60` WITHOUT `backdrop-blur`. No search is rendered inside the mobile menu. The menu renders standardized content derived from auth.user (Account card + Sign In/Sign Up or Dashboard/Profile/Sign Out + LANGUAGE section), NOT the page-specific `children` prop — those only render on desktop inside `hidden md:flex`. Keep `md:hidden` on the hamburger/menu and `hidden md:flex` on desktop nav; changing this shifts desktop layout.

## Member search is an icon + centered modal, not an inline input
There is no SearchInput in the navbar. When a page passes a `members` prop to Navbar, a magnifier-icon button renders beside ThemeToggle and opens search-modal.tsx — a centered modal that live-filters member name/location/age/bio client-side, links results to members.show, and shows a "No results for '{query}'" empty state. Pages without member data (guests, member detail, auth pages) get no search icon. Modal/menu enter+exit animation is done with class toggles on always-mounted markup — never setState in useEffect (react-hooks/set-state-in-effect is enabled with React Compiler).
