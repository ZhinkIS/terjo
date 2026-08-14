---
paths:
  - app/Models/Setting.php
---

# Models

## Landing hero text is DB-driven with fallbacks
The welcome page headline/tagline are NOT hardcoded. settings.hero_title + hero_subtitle (nullable) drive them; Setting::heroTitle()/heroSubtitle() return default fallbacks ('Komunitas ' + app.name and the otomotif tagline) when null. HomeController passes camelCase heroTitle/heroSubtitle props to 'welcome'; DashboardController exposes them as settings.hero_title/hero_subtitle for the SettingsTab form (admin/owner). UpdateSettingsRequest allows nullable strings. When adding hero edits, keep both consumers in sync.

## Type-check cached Setting model (__PHP_Incomplete_Class guard)
Setting::current() stores an Eloquent model in cache. After a class change the cached payload can unserialize into __PHP_Incomplete_Class (never an instanceof Setting), which crashes callers. The method must type-check (instanceof self) before returning and rebuild+Cache::put on mismatch. Keep this guard whenever storing models in cache.
