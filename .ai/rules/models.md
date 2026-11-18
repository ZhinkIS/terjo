---
paths:
  - app/Models/Setting.php
---

# Models

## Landing hero headline is DB-driven; tagline is i18n
settings.hero_title (nullable) drives the welcome headline; Setting::heroTitle() returns a default fallback ('Komunitas ' + app.name) when null. The welcome tagline is the frontend key `hero.tagline`, not `hero_subtitle`. HomeController still sends camelCase heroTitle/heroSubtitle props to 'welcome'; `heroSubtitle` is no longer rendered there, while DashboardController still exposes settings.hero_title/hero_subtitle for the SettingsTab form (admin/owner). UpdateSettingsRequest allows nullable strings. When adding hero edits, decide whether the change affects the rendered i18n tagline or only the unused backend subtitle.

## Type-check cached Setting model (__PHP_Incomplete_Class guard)
Setting::current() stores an Eloquent model in cache. After a class change the cached payload can unserialize into __PHP_Incomplete_Class (never an instanceof Setting), which crashes callers. The method must type-check (instanceof self) before returning and rebuild+Cache::put on mismatch. Keep this guard whenever storing models in cache.
