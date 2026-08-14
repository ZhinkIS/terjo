---
paths:
  - 'app/Http/Middleware/**'
---

# Middleware

## Guest middleware must redirect to home, not dashboard
The framework RedirectIfAuthenticated defaultRedirectUri() iterates ['dashboard', 'home'] and picks dashboard first. App has a subclass App\Http\Middleware\RedirectIfAuthenticated whose redirectTo() returns route('home'); it is aliased as 'guest' in bootstrap/app.php. Keep redirects pointing at home — dashboard is not the app's landing page.
