---
paths:
  - vite.config.ts
---

# General

## Keep built CSS filenames stable on Vercel
Vercel can reuse a PHP function bundle across deployments that only change built assets, so Laravel's cached Vite manifest can point at a hashed CSS file that no longer exists. Emit CSS as assets/app.css (and fonts as assets/fonts.css) via rollupOptions.output.assetFileNames for .css assets; keep hashes for JS and fonts. AppServiceProvider::clearViteManifestCache() also clears Vite's static manifest cache when VERCEL is set. Do not reintroduce hashed CSS filenames.
