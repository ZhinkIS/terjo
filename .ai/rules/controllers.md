---
paths:
  - 'app/Http/Controllers/**'
---

# Controllers

## Seeded absolute image paths must not be deleted on replace
Avatar/profile & site-logo URLs are stored as full web paths. Seeded values start with '/images/...' (absolute, never delete). Uploaded files are stored on the public disk (e.g. avatars/, settings/) and saved as Storage::url() = '/storage/...' — only these may be deleted when replaced (strip '/storage/' then Storage::disk('public')->delete()).

## Laravel cache layout: version counter + eager key forgets
Home/dashboard lists are cached via Cache::remember. Member-derived lists (members.directory, dashboard.members, dashboard.pending) embed User::DIRECTORY_VERSION_KEY (bumped in User::booted() saved/deleted hooks) in their keys so one increment invalidates all viewer variants. Slideshows: 'slideshows.all' + 'home.slideshows' must BOTH be forgotten on any slideshow mutation (reorder/store/update/destroy). Settings: forget Setting::CACHE_KEY after SettingsController update. No cache tags — stores are array (tests) / database (dev), which don't support tags. Use Cache::remember for cache-hit reads; every cache write must have a matching invalidate path.
