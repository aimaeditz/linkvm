# LinkVM — Project Log

Single source of truth. Every session appends a new entry. Never overwrite existing entries.

## 2026-09-26
Summary: Patched github.io subdomain 404 routing with positive allowlist, cleaned stale build bundles, added bundle guard to README, and created permanent project log.
Files touched:
- app-source/src/App.tsx
- app-source/vite.config.ts
- README.md
- PROJECT_LOG.md
- index.html
- assets/index-YudgiBl-.js
- assets/index-qWXJ7a9M.css
Commit: 7ffeb60
Open issues: none

## 2026-09-26
Summary: Fixed Google sign-in via Firebase with host-aware authorization check, separated /login and /signup auth screens, removed non-production domains from auth flow, and enforced real Google identity only.
Files touched:
- app-source/src/lib/auth-host.ts
- app-source/src/components/auth/LoginPage.tsx
- app-source/src/components/auth/SignupPage.tsx
- app-source/src/App.tsx
- app-source/src/lib/firebase.ts
- app-source/src/lib/storage.ts
- PROJECT_LOG.md
Commit: cc9a074
Open issues: none

## 2026-09-26
Summary: Full production readiness pass. Enforced linkvm.online canonical domain, removed all demo/fallback state and mock creators, added select_account prompt to Google Auth, made Firestore and Auth strictly env-driven, and cleaned module-load error logging.
Files touched:
- app-source/src/lib/firebase.ts
- app-source/src/lib/storage.ts
- app-source/src/lib/site.ts
- app-source/src/lib/auth-host.ts
- app-source/src/lib/referrals.ts
- app-source/src/App.tsx
- app-source/src/components/auth/LoginPage.tsx
- app-source/src/components/auth/SignupPage.tsx
- app-source/src/components/auth/ForgotPasswordPage.tsx
- firestore.rules
- PROJECT_LOG.md
Commit: prod-pass-01
Open issues: none

