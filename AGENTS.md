<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to ensure the best experience when building Laravel applications.

## Foundational Context

This application is a Laravel application running on PHP 8.3. You are an expert with the Laravel ecosystem. Always use the APIs that match the installed major version of each package — do not assume a version.

Before relying on a package's API, confirm its installed version:
- PHP packages: run `composer show --direct` to list direct dependencies with versions, or `composer show <vendor/package>` for a single package.
- JS packages: check `package.json` for the installed versions.

## Skills Activation

This project has domain-specific skills available in `**/skills/**`. You MUST activate the relevant skill whenever you work in that domain—don't wait until you're stuck.

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, and naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests cover that functionality and prove they work. Unit and feature tests are more important.

## Application Structure & Architecture

- Stick to existing directory structure; don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling

- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

## Replies

- Be concise in your explanations - focus on what's important rather than explaining obvious details.

=== boost rules ===

# Laravel Boost

## Tools

- Laravel Boost is an MCP server with tools designed specifically for this application. Prefer Boost tools over manual alternatives like shell commands or file reads.
- Use `database-query` to run read-only queries against the database instead of writing raw SQL in tinker.
- Use `database-schema` to inspect table structure before writing migrations or models.
- Use `get-absolute-url` to resolve the correct scheme, domain, and port for project URLs. Always use this before sharing a URL with the user.
- Use `browser-logs` to read browser logs, errors, and exceptions. Only recent logs are useful, ignore old entries.

## Searching Documentation (IMPORTANT)

- Always use `search-docs` before making code changes. Do not skip this step. It returns version-specific docs based on installed packages automatically.
- Pass a `packages` array to scope results when you know which packages are relevant.
- Use multiple broad, topic-based queries: `['rate limiting', 'routing rate limiting', 'routing']`. Expect the most relevant results first.
- Do not add package names to queries because package info is already shared. Use `test resource table`, not `filament 4 test resource table`.

### Search Syntax

1. Use words for auto-stemmed AND logic: `rate limit` matches both "rate" AND "limit".
2. Use `"quoted phrases"` for exact position matching: `"infinite scroll"` requires adjacent words in order.
3. Combine words and phrases for mixed queries: `middleware "rate limit"`.
4. Use multiple queries for OR logic: `queries=["authentication", "middleware"]`.

## Project Rules

- This project contains committed, area-grouped rules in `.ai/rules` when that directory exists (settled decisions, non-obvious traps, standing constraints). Framework and package guidelines that only apply to specific paths (testing, frontend, components) also live there, under `.ai/rules/boost` — this is not just recorded decisions, it is load-bearing guidance you have not seen inline. Before you enter plan mode or create/edit any file, you MUST first: open @.ai/rules/index.md (it maps file globs to rule files), read every rule file whose globs cover the path(s) in scope, and run `grep -rin 'keyword' .ai/rules` to catch what a path match alone misses. Do not write code until you have read and are following every matching rule. If `.ai/rules` does not exist, continue without it.
- Record durable rules with `record-rule` so the next agent or teammate inherits them instead of working them out again. Pass a `glob` (e.g. `app/Http/Controllers/**`), a short `title`, and a few-line `note`. Always use `record-rule`, never your native memory or notes tool — native memory is personal and session-scoped; only `.ai/rules` is shared with the team and persists in the repo.

## Artisan

- Run Artisan commands directly via the command line (e.g., `php artisan route:list`). Use `php artisan list` to discover available commands and `php artisan [command] --help` to check parameters.
- Inspect routes with `php artisan route:list`. Filter with: `--method=GET`, `--name=users`, `--path=api`, `--except-vendor`, `--only-vendor`.
- Read configuration values using dot notation: `php artisan config:show app.name`, `php artisan config:show database.default`. Or read config files directly from the `config/` directory.

## Tinker

- Execute PHP in app context for debugging and testing code. Do not create models without user approval, prefer tests with factories instead. Prefer existing Artisan commands over custom tinker code.
- Always use single quotes to prevent shell expansion: `php artisan tinker --execute 'Your::code();'`
  - Double quotes for PHP strings inside: `php artisan tinker --execute 'User::where("active", true)->count();'`

=== php rules ===

# PHP

- Always use curly braces for control structures, even for single-line bodies.
- Use PHP 8 constructor property promotion: `public function __construct(public GitHub $github) { }`. Do not leave empty zero-parameter `__construct()` methods unless the constructor is private.
- Use explicit return type declarations and type hints for all method parameters: `function isAccessible(User $user, ?string $path = null): bool`
- Use TitleCase for Enum keys: `FavoritePerson`, `BestLake`, `Monthly`.
- Prefer PHPDoc blocks over inline comments. Only add inline comments for exceptionally complex logic.
- Use array shape type definitions in PHPDoc blocks.

=== deployments rules ===

# Deployment

- Laravel can be deployed using [Laravel Cloud](https://cloud.laravel.com/), which is the fastest way to deploy and scale production Laravel applications.

=== inertia-laravel/core rules ===

# Inertia

- Inertia creates fully client-side rendered SPAs without modern SPA complexity, leveraging existing server-side patterns.
- Components live in `resources/js/pages` (unless specified in `vite.config.js`). Use `Inertia::render()` for server-side routing instead of Blade views.
- ALWAYS use `search-docs` tool for version-specific Inertia documentation and updated code examples.
- IMPORTANT: Activate `inertia-react-development` when working with Inertia client-side patterns.

# Inertia v3

- Use all Inertia features from v1, v2, and v3. Check the documentation before making changes to ensure the correct approach.
- New v3 features: standalone HTTP requests (`useHttp` hook), optimistic updates with automatic rollback, layout props (`useLayoutProps` hook), instant visits, simplified SSR via `@inertiajs/vite` plugin, custom exception handling for error pages.
- Carried over from v2: deferred props, infinite scroll, merging props, polling, prefetching, once props, flash data.
- When using deferred props, add an empty state with a pulsing or animated skeleton.
- Axios has been removed. Use the built-in XHR client with interceptors, or install Axios separately if needed.
- `Inertia::lazy()` / `LazyProp` has been removed. Use `Inertia::optional()` instead.
- Prop types (`Inertia::optional()`, `Inertia::defer()`, `Inertia::merge()`) work inside nested arrays with dot-notation paths.
- SSR works automatically in Vite dev mode with `@inertiajs/vite` - no separate Node.js server needed during development.
- Event renames: `invalid` is now `httpException`, `exception` is now `networkError`.
- `router.cancel()` replaced by `router.cancelAll()`.
- The `future` configuration namespace has been removed - all v2 future options are now always enabled.

=== laravel/core rules ===

# Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using `php artisan list` and check their parameters with `php artisan [command] --help`.
- If you're creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Model Creation

- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `php artisan make:model --help` to check the available options.

## APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

## URL Generation

- When generating links to other pages, prefer named routes and the `route()` function.

## Testing

- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

## Vite Error

- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.

=== wayfinder/core rules ===

# Laravel Wayfinder

Use Wayfinder to generate TypeScript functions for Laravel routes. Import from `@/actions/` (controllers) or `@/routes/` (named routes).

=== pint/core rules ===

# Laravel Pint Code Formatter

- If you have modified any PHP files, you must run `vendor/bin/pint --dirty --format agent` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test --format agent`, simply run `vendor/bin/pint --format agent` to fix any formatting issues.

=== pest/core rules ===

## Pest

- This project uses Pest for testing. Create tests: `php artisan make:test --pest {name}`.
- The `{name}` argument should not include the test suite directory. Use `php artisan make:test --pest SomeFeatureTest` instead of `php artisan make:test --pest Feature/SomeFeatureTest`.
- Run tests: `php artisan test --compact` or filter: `php artisan test --compact --filter=testName`.
- Do NOT delete tests without approval.

=== inertia-react/core rules ===

# Inertia + React

- IMPORTANT: Activate `inertia-react-development` when working with Inertia React client-side patterns.

</laravel-boost-guidelines>

# Project

Laravel 13 (PHP 8.3) + Inertia v3 + React 19 + TypeScript (strict) + Tailwind v4 + Vite 8 + Pest 4. This is the **Terjocore community site** (exclusive automotive community); UI copy is Indonesian. The `boost.json`-managed guidelines above are rewritten in place by `composer update` — keep repo-specific notes in this section, not inside that block.

## Local DB is MySQL (tests use SQLite)

- Dev `.env` and `.env.example` use **MySQL** (Laragon, db `terjocore`) — NOT SQLite. `database/database.sqlite` is a starter-kit leftover; ignore it.
- Tests run against in-memory SQLite (`phpunit.xml`), so avoid MySQL-only SQL that must pass CI.

## Membership & access control (core domain)

- `users.role` enum `owner|admin|member`; `users.status` enum `pending|approved|rejected` (DB default is `pending` — every user creator must set it).
- Registration always creates `role=member, status=pending`, then redirects to `pending`. `EnsureApprovedUser` (appended to the web group in `bootstrap/app.php`) quarantines pending users to the `pending` and `logout` routes only.
- **Login redirects back to the home page** — `AuthenticatedSessionController::store` returns `redirect()->route('home')`, never `/dashboard`. The `guest` middleware alias is `App\Http\Middleware\RedirectIfAuthenticated` (subclasses the framework one) so already-authenticated users hitting `/login` also bounce to `home`, not `dashboard`. Pending users still land on `/pending` because `EnsureApprovedUser` intercepts `/`.
- The home page member directory is shown ONLY to authenticated, approved users; `HomeController` doesn't even send the `members` prop to guests.
- Admin flows are behind the `role:admin` middleware alias + `UserPolicy`: admins manage members, the owner is absolute, nobody deletes themselves. Approve = set `approved` (never a role change); reject = delete the account.
- The **Rules popup** is `resources/js/components/rules-modal.tsx` — a hardcoded `RULES` list ("Terjo Legalis Pactum", numbered 1-18 with separators) opened by the `RULES!!!` button on the welcome page. The button renders ONLY for authenticated, approved users (guests never see it). Rules are NOT DB-driven yet; the register page does not show them.

## Current feature state

- **Done:** auth, pending-approval flow, member directory + detail (`members.show`), admin slideshows/settings/member management, hero carousel, rules modal, mobile navbar (theme toggle outside hamburger, links under the X), main Navbar + `< Kembali ke halaman utama` on auth pages.
- **Welcome hero is a full-bleed dark section** (streaming-style): bg `/images/slide1.jpg` under a gradient overlay, always dark in both themes; content is left-aligned and splits on `auth.user`. The guest landing is a single fixed 100vh screen (`h-svh` + `overflow-hidden`, no page scroll): guests see huge bold "Komunitas Terjocore" + fixed subtitle + a prominent "Login / Masuk" button, and the footer text is pinned inside the hero bottom — no search/slideshow/RULES/directory. Members get the settings `heroTitle`/`heroSubtitle` + RULES button + member count in the hero, with slideshow + directory below (scrollable, standalone footer). `HomeController` still sends `slideshows`/`heroTitle`/`heroSubtitle` to everyone; React hides them for guests.
- The decorative hero `<img>` and gradient overlay are `pointer-events-none`; the Navbar overlay is `z-20`. The hero bg was `slide.jpg` once by mistake — the file only exists as `slide1.jpg`/`slide2.jpg` (see seeded-photo rule).
- Guest navbar right side = `ThemeToggle` + `AccountDropdown` (`resources/js/components/account-dropdown.tsx`, English labels: Account / Sign In / Sign Up / Language; Sign In→login, Sign Up→register; language stored under the same `preferred-language` key as members). Search bar never renders for guests.
- `Navbar`, `AccountMenu`, `AccountDropdown`, `ThemeToggle`, and `SearchInput` accept an optional `overlay` prop (absolute over the dark hero, light text/borders, translucent search input); only the welcome page passes it — keep the default styling elsewhere.
- Slideshows are **position-ordered** (`slideshows.position`, default 0; engine reorders via `PUT admin.slideshows.reorder`). They're managed inline in the Site Settings tab via `resources/js/components/slideshow-manager.tsx` (upload / active toggle / delete / up-down reorder); the standalone `admin/slideshows` pages still exist.
- **Chat is modeled but not built:** `conversations`, `conversation_user`, `messages` tables + models, factories, `ChatSeeder` (global chat, `messages.body` is `encrypted`), and `ChatTest` exist, but there are **no chat routes or UI yet** — the likely next feature.

## Load-bearing `.ai/rules`

Before creating/editing any file, read the rule files matched in `.ai/rules/index.md` and grep `keyword` in `.ai/rules`. They hold traps not inferable from filenames, e.g.: Wayfinder needs unique route names per verb (`login` vs `login.store`); the public `MemberController` must be imported `as PublicMemberController` in `routes/web.php`; never delete seeded `/images/...` paths (AvatarService strips only `/storage/`); no eager `import.meta.glob` resolver in `app.tsx` (breaks per-page manifest entries).

## Generated code (never hand-edit)

- `resources/js/actions`, `resources/js/routes`, and `resources/js/wayfinder` are **Wayfinder output**, gitignored, and excluded from ESLint. Import route helpers from `@/routes` and controller actions from `@/actions` in TSX/TS.
- The `@laravel/vite-plugin-wayfinder` plugin (`formVariants: true`) regenerates them whenever Vite runs. After adding/changing routes, regenerate before typechecking via `php artisan wayfinder:generate`.

## Commands

- JS package manager is **npm** (`package-lock.json`; `composer setup`/scripts call `npm`). The `pnpm-workspace.yaml` at the root is a leftover starter-kit artifact — ignore it.
- `.npmrc` sets `ignore-scripts=true`, so npm lifecycle scripts never run.
- Dev servers: `npm run dev` (Vite HMR only) or `composer run dev` (concurrently runs `php artisan serve` + `queue:listen` + Vite).
- Per-file verification: `npm run types:check` (tsc), `npm run lint`/`lint:check` (ESLint), `npm run format`/`format:check` (Prettier), `composer lint`/`lint:check` (Pint), `composer types:check` (PHPStan), `php artisan test --compact --filter=...`.
- `composer ci:check` is the full gate and mirrors `.github/workflows/tests.yml` (PHP 8.3, Node 22, `composer setup` then `composer ci:check`; runs on PRs and push to `main`).

## Frontend conventions

- Tailwind v4 is CSS-first: there is **no `tailwind.config.js`**. Theme/fonts are declared with `@theme` in `resources/css/app.css`. Instrument Sans is self-hosted via the Vite `bunny()` font plugin, not a font file.
- ESLint enforces: `consistent-type-imports` (separate `import type { … }`), alphabetical `import/order`, 1TBS braces, and blank lines around control statements. `npm run lint` autofixes; `lint:check` only reports.
- Prettier: 4-space indent, single quotes, `printWidth: 80`, `prettier-plugin-tailwindcss` aware of `clsx`/`cn`/`cva` calls. Use the `cn()` helper from `resources/js/lib/utils.ts` for class merging.
- React Compiler is enabled via `babel-plugin-react-compiler` in `vite.config.ts` — write memoization-free render code.
- SSR is on; `resources/js/components/theme-provider.tsx` must guard every `window`/`document`/`localStorage`/`matchMedia` access (`typeof window === 'undefined'` or `useEffect`) so it never crashes on the Node server ("window is not defined").
- Shared Inertia props are declared in `HandleInertiaRequests::share()` **and** typed as `sharedPageProps` in `resources/js/types/global.d.ts`. Keep both in sync; `sidebarOpen` in the TS type is an orphaned leftover with no backend counterpart.
- Static pages without controller logic use `Route::inertia()` (see `routes/web.php`); pages live in `resources/js/pages`.

## Backend / testing

- PHPStan runs at **level 7** (`phpstan.neon`) — full return types and type hints are mandatory.
- Pest feature tests already apply `RefreshDatabase` via `tests/Pest.php`; tests run against in-memory SQLite (`phpunit.xml`). Create tests with `php artisan make:test --pest`.
- Seeded data is load-bearing: `UserSeeder` seeds exactly 34 approved users (owner + 3 admins + 30 members); `SeederTest` asserts the count. Follow the existing model style — Laravel 13 attributes `#[Fillable]`/`#[Hidden]`, `Message.body` encrypted.
- `SlideshowSeeder` only creates rows referencing `/images/slide1.jpg` + `/images/slide2.jpg` — those prepared photos in `public/images` must NOT be regenerated/replaced (the GD gradient generator was removed; keep it that way).

