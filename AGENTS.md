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
- Record durable rules with `record-rule` so the next agent or teammate inherits them instead of working it out again. Pass a `glob` (e.g. `app/Http/Controllers/**`), a short `title`, and a few-line `note`. Always use `record-rule`, never your native memory or notes tool — native memory is personal and session-scoped; only `.ai/rules` is shared with the team and persists in the repo.

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

**Terjocore** — exclusive automotive community. Laravel 13 (PHP 8.3) + Inertia v3 + React 19 + TypeScript strict + Tailwind v4 + Vite 8 + Pest 4. UI copy and `APP_LOCALE` are Indonesian (`id`).

## Ground rules
- Before planning or editing, read `.ai/rules/index.md` and every rule file whose globs match the paths in scope; `grep -rin 'keyword' .ai/rules` for what path matching misses. These hold non-obvious traps (Wayfinder, caching, images, i18n).
- Record durable decisions with `laravel-boost.record-rule` — not native memory. Skills live in `.agents/skills/`; Boost MCP is configured in `opencode.json`.
- The `<laravel-boost-guidelines>` block above is maintained by `boost:update` (composer `post-update-cmd`); don't hand-edit it. Put project guidance below.

## Commands
- Package manager: **npm** (`package-lock.json`); ignore `pnpm-workspace.yaml`. `.npmrc` sets `ignore-scripts=true`.
- Setup: `composer setup` (install, copy `.env` only if missing, **always regenerate `APP_KEY`**, `migrate --force`, `npm install`, `npm run build`). Never run it in an existing checkout against the shared DB: rotating `APP_KEY` orphans encrypted `Message.body` and invalidates sessions, and `migrate --force` targets the remote DB in local `.env`. It does **not** seed; `php artisan migrate --seed` creates the 34-user fixture but is not idempotent — see the DB warning below first.
- Dev: `composer run dev` (serve + queue listener + Vite) or `npm run dev`.
- Single test: `php artisan test --compact --filter=TestName` (or pass a path). Feature tests auto-use `RefreshDatabase` via `tests/Pest.php`; Unit tests do not. Backend gate: `composer test` (clears config, then Pint check → PHPStan → Pest). Local full gate: `npm run lint:check && npm run format:check && npm run types:check && composer test`; autofix frontend with `npm run lint` / `npm run format`.
- `composer ci:check` is broken as written: its bare `types:check` entry is run as a shell command, not the npm script, so it fails after the frontend checks. Use the explicit chain above; CI also has a DB problem (see Deployment).
- Feature tests assert Inertia via `assertInertia(fn (Assert $page) => ...)`, not `assertViewHas`. Build users with factory states (`asOwner()`, `asAdmin()`, `asMember()`, `asSlave()`, `asPending()`, `asRejected()`); the default is `member` + `approved`.
- No JS test runner (`npm test` does not exist) and no Pest browser plugin: verify frontend with `npm run lint:check`, `npm run format:check`, `npm run types:check`; use HTTP feature tests (`$this->get()`/`post`), not `visit()`.
- After editing PHP: `vendor/bin/pint --dirty --format agent` (full tree: `composer lint` / `composer lint:check`). PHPStan (level 7) analyses `app/`, `bootstrap/app.php`, `config/`, `database/`, `routes/` — not `tests/`.
- No README; `composer.json` scripts and `package.json` scripts are the source of truth.

## Architecture
- All application routes are in `routes/web.php` (no API routes). Controllers are thin: validation usually lives in `app/Http/Requests`, authorization uses `Gate`/policies, then `Inertia::render('page', props)`; shared props come from `HandleInertiaRequests::share()`.
- `HomeController` = landing page; `DashboardController` = one role-aware dashboard with profile/member-management/settings tabs, refreshed in place by `usePoll(5000)`; `PendingController` = quarantine page whose `pending.status` JSON endpoint is polled. Chat models/tables/tests exist but have **no routes or UI**.
- Two `MemberController`s: the public `App\Http\Controllers\MemberController` must be imported as `PublicMemberController` in `routes/web.php`. Avatar uploads/deletes go through `App\Services\AvatarService`, never ad-hoc `Storage` calls.
- Wayfinder groups routes by **name**, so each verb needs a unique name (`login` / `login.store`); duplicate names break generated `resources/js/routes/index.ts` and the build.

## Env & DB
- **Local `.env` uses remote Supabase Postgres** (`DB_CONNECTION=pgsql`, pooler host); `.env.example` still says MySQL `terjocore`. Treat dev data as shared — never run `migrate:fresh`/`db:wipe`/`--seed` against dev without explicit approval. `DB::prohibitDestructiveCommands` only blocks destructive commands in production, so local `APP_ENV=local` does not protect the remote DB.
- Tests are safe: `phpunit.xml` forces SQLite `:memory:` (array cache/session), so keep SQL portable. The `slave` enum migration branches on the driver (`pgsql` vs enum `change()`), a good example to follow.
- Uploads are local-only: code writes to the explicit `public` disk (`storage/app/public`, symlinked at `public/storage`); `FILESYSTEM_DISK=local` only points at `storage/app/private` and is not used for media. `public/storage` is gitignored — run `php artisan storage:link` after cloning or uploaded media 404s. `Storage::url()` is built from `APP_URL` (local `.env`: `http://192.168.1.6:8000`). Cache/session/queue are database-backed in both `.env` files.

## Access model
- `UserRole` = `owner|admin|member|slave`, ranked owner 4 > admin 3 > member 2 > slave 1. `role:` middleware compares rank, so `role:admin` also admits owners. `users.status` = `pending|approved|rejected` (DB default `pending`); keep the UI labels in `UserStatus::label()` in sync.
- Registration always creates `member` + `pending` and redirects to `pending`. `EnsureApprovedUser` (appended to the `web` group) allowlists only routes named `pending`, `pending.status`, and `logout`; every other pending request redirects to `pending`.
- `guest` alias is the app's `RedirectIfAuthenticated`, which sends authenticated users to `home`; login POST also redirects to `home`, not `/dashboard`.
- `UserPolicy`: owner updates any non-owner; admin updates only `member`/`slave`; anyone may update self. Nobody deletes self; admin cannot touch owner/admin. Approve changes status only; reject deletes the account. Role changes accept `admin|member|slave` — nobody can become owner.
- Guests get neither `slideshows` nor `members`; approved members get both on `home` (pending users are redirected before it renders). `members.show` requires auth, 404s when the target user is not approved, and redirects a pending viewer to `pending`.
- Seeded logins: `owner@terjocore.test`, `admin1..admin3@terjocore.test`, `member1..member30@terjocore.test`; password `password`.

## Caching & media (easy to break)
- `config/cache.php` sets `serializable_classes => false`: never cache objects/models — arrays/scalars only. `Setting::current()` caches attributes + a per-request container memo; call `Setting::flushCache()` after settings writes.
- User-derived cache keys embed `User::DIRECTORY_VERSION_KEY`, bumped by `User::booted()` on save/delete. Slideshow writes must forget **both** `slideshows.all` and `home.slideshows`. No cache tags (array/database stores don't support them).
- Seeded media paths start with `/images/...` and must never be deleted. Uploaded media deletion differs: avatar URLs are `/storage/avatars/...` (strip `/storage/` first), while slideshow `image_path` and settings `logo_path` are relative public-disk paths. `slide1.jpg`/`slide2.jpg` are the only seeded slideshow images — do not regenerate or replace them. `public/images/avatars/*.svg` are generated by `UserSeeder` and committed.
- `HomeController` silently drops slideshows whose file is missing on the public disk; tests that `Storage::fake('public')` must also `put()` each slideshow file (factory defaults point at `/images/slide1.jpg`, absent from the fake disk).
- `UserSeeder` creates exactly 34 approved users (1 owner, 3 admins, 30 members); `SeederTest` asserts that plus 2 slideshows. `ChatSeeder` creates a global conversation with 3 welcome messages and is idempotent; `Message.body` is encrypted at rest. `UserSeeder`/`SlideshowSeeder` are **not idempotent** (fixed unique emails; unconditional inserts), so don't re-seed a populated DB.
- Most models use Laravel 13 attributes (`#[Fillable([...])]` / `#[Hidden([...])]`); `Setting` is the exception and still uses `$fillable`.

## Frontend
- `resources/views/app.blade.php` loads each page with `@vite([... "resources/js/pages/{$page['component']}.tsx"])`, so a page rendered as `auth/login` must live at `resources/js/pages/auth/login.tsx` and default-export the component. `config/inertia.php`'s `ensure_pages_exist` makes tests fail when that file is missing.
- `createInertiaApp` must keep `withApp` (providers) and **no** `resolve`/eager `import.meta.glob` — that collapses per-page chunks into `app.js` and causes manifest 500s.
- Wayfinder output in `resources/js/actions|routes|wayfinder` is committed but ignored by ESLint/Prettier; never hand-edit it and import helpers from `@/routes`/`@/actions` instead of hardcoding URLs. `@/*` maps to `resources/js/*`; root routes are named exports from `@/routes`, while per-name groups default-export (`store` from `@/routes/login`). On `welcome.tsx` import `memberRoutes` from `@/routes/members` so the `members` prop doesn't shadow it.
- Regenerate Wayfinder with `php artisan wayfinder:generate --with-form` after route changes (the Vite plugin does it in dev; `vite.config.ts` skips it when `VERCEL` is set, so `composer vercel` regenerates first). `public/build` is committed too; run `npm run build` before finishing (or `npm run dev` while iterating) so the tracked manifest/assets match — a stale manifest causes `ViteException`.
- React Compiler is enabled: write memoization-free code. `react-hooks/set-state-in-effect` is enforced, so toggle always-mounted markup with classes instead of state-in-effect animations.
- Every button/button-styled link needs `active:scale-95` (`active:scale-[0.98]` for full-width rows) and keeps the existing `transition` class for color transitions.
- i18n: use `useLanguage()`/`t()`; keys are typed by `Dictionary` from `resources/js/i18n/locales/id.ts`, so add each key to both `id.ts` and `en.ts`. Server-side validation/auth strings live in `lang/id` and `lang/en`. Locale persists in `localStorage['preferred-language']`; `LanguageProvider` must keep `useSyncExternalStore` with server snapshot `'id'`.
- SSR is opt-in via `INERTIA_SSR=true` (currently `false`); `ThemeProvider` must still guard `window`/`matchMedia`. Shared props must stay in sync between `HandleInertiaRequests::share()` and `sharedPageProps` in `resources/js/types/global.d.ts`.
- Tailwind v4 CSS-first: theme tokens in `resources/css/app.css` (no `tailwind.config.js`); fonts via Vite `bunny()`. Use `cn()` from `resources/js/lib/utils.ts`. ESLint enforces type imports, alphabetical import order, 1TBS, `curly`, and blank lines around control statements; Prettier uses 4 spaces/single quotes/80 cols. `npm run format` only touches `resources/`.
- Navbar/search/modal/welcome/dashboard layout specifics are in `.ai/rules/components.md` and `.ai/rules/pages.md` — read them before restyling.

## Deployment
- Vercel: `api/index.php` requires `public/index.php`; `vercel.json` pins runtime `vercel-php@0.7.3` and routes `/build`, `/images`, `/storage` to `public/`. `bootstrap/app.php` relocates storage and bootstrap to `/tmp` when `VERCEL` is set; treat that as ephemeral (uploads do not survive deploys/instances).
- Build/deploy with `composer vercel` (wayfinder → `npm ci` → build), because the Vite Wayfinder plugin is disabled during Vercel builds.
- CI (`.github/workflows/tests.yml`): PRs + pushes to `main`, PHP 8.3 / Node 22, runs `composer setup` then `composer ci:check`. As configured it can't reach the tests: `composer setup` migrates `.env.example` (MySQL `terjocore`) with no DB service, and `ci:check` hits the bare `types:check` bug. Don't treat red CI as proof your change broke something.
