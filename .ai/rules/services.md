---
paths:
  - app/Services/AvatarService.php
---

# Services

## AvatarService is the single avatar upload/delete path
ProfileController and Admin\MemberController both inject App\Services\AvatarService for avatar handling: store() saves to 'avatars' on the public disk, deleteExisting() strips '/storage/' and deletes, but NEVER deletes seeded absolute paths starting with '/images/...'. UpdateMemberRequest and UpdateProfileRequest both validate profile_picture as image jpg/jpeg/png/webp max 4096. Always route avatar uploads through this service, not ad-hoc Storage calls.
