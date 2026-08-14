---
paths:
  - app/Http/Controllers/Admin/RegistrationController.php
---

# Admin

## Registration approval flow (member onboarding)
New registrations are always created as role=member + status=pending and redirected to route('pending'). EnsureApprovedUser middleware (web group) quarantines pending users everywhere except routes named `pending` and `logout`. Approve/reject/kick only via UserPolicy: update = owner | self | (admin && member); delete = not self && (owner || admin && member) — so admins can only handle members, the owner can also handle admins, and nobody can delete themselves. Approve sets status=approved (never role change); reject deletes the account.
