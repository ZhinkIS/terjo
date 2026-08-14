---
paths:
  - 'app/**'
---

# App

## Cache arrays, never objects (serializable_classes=false)
config/cache.php sets 'serializable_classes' => false (Laravel 13 security default): the cache store unserializes with allowed_classes=false, so ANY cached object (e.g. an Eloquent model) comes back as __PHP_Incomplete_Class -> TypeError. NEVER Cache::put a model/object; always cache plain arrays (Setting::current caches getAttributes() and rehydrates with new self($attributes)). This is also why every 'cache hit' of a model silently behaved like a miss. Arrays and scalars pass through unaffected.
