---
paths:
  - 'routes/**'
  - routes/web.php
---

# Routes

## Wayfinder butuh nama route unik per verb
Wayfinder (vite-plugin & artisan) meng-group route berdasarkan nama route, bukan verb. Dua route bernama sama (mis. GET /login dan POST /login sama-sama 'login') menghasilkan `export const login` ganda di resources/js/routes/index.ts yang memecah `npm run build`. Beri nama berbeda per verb: GET 'login', POST 'login.store'. Impor POST di React dari '@/routes/login' (export `store`).

## Alias public MemberController to avoid class collision
There are two MemberControllers: App\Http\Controllers\Admin\MemberController (admin management) and App\Http\Controllers\MemberController (public detail page). In routes/web.php the public one must be imported with an alias `use App\Http\Controllers\MemberController as PublicMemberController;` and referenced as [PublicMemberController::class, 'show'] — otherwise PHP throws "Cannot use ... because the name is already in use". The public route is `GET /members/{user}` named `members.show`, auth-protected.
