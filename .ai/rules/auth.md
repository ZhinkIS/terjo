---
paths:
  - resources/js/pages/auth/login.tsx
---

# Auth

## Login page hosts both auth forms
`resources/js/pages/auth/login.tsx` renders both the login and registration forms in a split panel toggled by local `isLogin` state; it does not navigate to `/register`. Keep the two separate `useForm` instances and post to `login.store`/`register.store`. Desktop uses an absolutely positioned half-width overlay that slides with `translate-x-full`; mobile hides that overlay and shows a static switch panel below the active form. Keep the inactive form `inert` and keep the `/register` page (`register.tsx`) working independently.
