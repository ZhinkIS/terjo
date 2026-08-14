---
paths:
  - database/seeders/UserSeeder.php
---

# Seeders

## UserStatus is load-bearing in seeds and factories
The users.status column (enum UserStatus: pending/approved/rejected) defaults to 'pending' at the DB level, so every user creator must set it. UserSeeder sets status=UserStatus::Approved on all 34 seeded users; the seeder test asserts exactly 34 approved. UserFactory defaults to status=Approved and provides asPending()/asRejected() states. Keep the UI label mapping in UserStatus::label() (Menunggu/Disetujui/Ditolak) in sync.
