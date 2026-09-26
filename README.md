# LinkVM (LinkVaultMe) — All Your Links. One Unified Page.

> **100% Free Forever Creator Bio Platform**  
> *Created by AiMAEditz*

LinkVM (LinkVaultMe) is a blazing-fast, modern, and privacy-conscious link-in-bio platform built for creators, developers, artists, and businesses.

---

## ✨ Features

- 🔗 **Unlimited Links**: Add, reorder, customize, and animate unlimited bio links with Lucide icons.
- 🎨 **34 Free Theme Presets**: Handcrafted color schemes, typography, corner radiuses, and glass/solid/gradient buttons across 6 categories.
- 🔒 **Username Uniqueness System**: Case-insensitive enforcement, reserved word filtering, real-time debounced availability scanning.
- 📊 **Real-Time Analytics**: Track views, clicks, CTR conversions, referrer sources, and device distribution with zero invasive third-party trackers.
- 📱 **Vector QR Code Suite**: Generate customizable vector SVG and ultra-high-resolution PNG QR codes with embedded center marks.
- ⚡ **Auto-Saving Data Service Layer**: Clean client-side persistence and abstraction (`AuthService` / `StorageService`) ready for seamless backend/Firebase swapping.
- 💯 **100% Free Forever**: Zero payments, zero subscriptions, zero ads, zero hidden fees.

---

## 🛠️ Tech Stack

- **Framework**: React 19 / Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Validation**: Zod
- **Animations**: Motion
- **Architecture**: Static Single Page Application (Root-level GitHub Pages deploy)

---

## 🚀 Deployment & Publishing Workflow (Root-Level Static Pattern)

LinkVM deploys to GitHub Pages using the exact root-level static deploy pattern: the production build writes directly to the repository **ROOT** (`index.html`, `assets/`, `404.html`, `favicon.ico`, `manifest.json`), and GitHub Pages serves the root of the `main` branch directly with **ZERO GitHub Actions** and **ZERO workflow failures**.

### 1. Local Development
```bash
cd app-source
npm install
npm run dev
```
Or from the root directory:
```bash
npm run dev
```
The local development server launches at `http://localhost:3000/linkvm/` (or `http://localhost:3000/`).

### 2. Publish & Deploy (Every Time You Finish Edits)
1. Build the production output to the repository root:
   ```bash
   cd app-source
   npm run build:root
   ```
   *(Or from root: `npm run build`)*
   This rebuilds and writes the fresh `index.html`, `assets/`, `404.html`, `manifest.json`, `icon.svg` directly to the repository root.
   - **Bundle Guard**: After every `npm run build:root`, only one JS + one CSS bundle should exist in `/assets`. If more appear, `--emptyOutDir` is not working and must be fixed.

2. From the repository root, commit and push to `main`:
   ```bash
   git add .
   git commit -m "Update static build"
   git push origin main
   ```

3. GitHub Pages automatically serves the new root build within ~1 minute! No Actions. No branch switching. No manual `dist/` handling.

---

## ⚙️ GitHub Pages Settings (One-Time Setup)

In your repository on GitHub:
1. Go to **Settings → Pages**.
2. **Build and deployment → Source**: Select **Deploy from a branch**.
3. **Branch**: Select `main` and Folder: `/(root)`.
4. Click **Save**.
5. Wait 1–2 minutes. The site will be live at:
   `https://aimaeditz.github.io/linkvm/`

---

## 🌐 Custom Domain Setup (`linkvm.online`)

LinkVM uses a single centralized environment variable `VITE_SITE_URL` for all referral links, vector QR codes, dynamic previews, and share URLs.

When you purchase and connect your custom domain (`https://linkvm.online/`):

1. **Update `.env`**:
   Change the single variable:
   ```env
   VITE_SITE_URL=https://linkvm.online/
   ```
2. **Add `CNAME` file**:
   Create a `CNAME` file at the repository root containing:
   ```
   linkvm.online
   ```
3. **Rebuild & push**:
   ```bash
   cd app-source && npm run build:root
   git add . && git commit -m "Switch to custom domain linkvm.online" && git push origin main
   ```
4. **GitHub Settings**:
   In your repository on GitHub: **Settings → Pages → Custom domain** → enter `linkvm.online` and save.

> ✨ **Zero Extra Code Changes Needed**: You do NOT need to touch any other source file. The entire app (referral generation, QR codes, previews, meta tags, and URL patterns) automatically updates from `VITE_SITE_URL`.

---

## 🧭 Routing & Deploy Notes

- **Repo Deploy Base**: Repo deploy uses base `/linkvm/` (matching `https://aimaeditz.github.io/linkvm/`).
- **Paired Redirect Scripts**: `404.html` and `index.html` scripts use `pathSegmentsToKeep = 1` for repository subpath deployments.
- **Custom Domain Switch**: When adding a custom domain: set `base: '/'` in `vite.config.ts`, set `pathSegmentsToKeep = 0` in both `404.html` and `index.html`, and update `VITE_SITE_URL`.
- **Root Landing Guarantee**: The root URL `/` must always render the Landing page with zero exceptions, never falling through to username resolution or 404.
- **Root 404 Prevention**: If a 404 ever appears at root: verify `base` in `vite.config.ts` and ensure `getNormalizedPath()` strips the base path cleanly before route evaluation.

---

## 🔧 Troubleshooting

### 1. 404 Assets (Broken CSS / JavaScript files)
- **Check base path**: Verify `base: '/linkvm/'` in `app-source/vite.config.ts`. If serving from repository subpath on GitHub Pages, the base must match `/linkvm/`. When switching to a custom root domain, change base to `'/'`.

### 2. Deep-Link 404 (404 Error on Direct Refresh or Direct URL like `/dashboard` or `/@username`)
- **Check root 404.html**: Ensure `404.html` exists at the repository root. GitHub Pages serves `404.html` on deep routes, which runs the SPA redirect script to restore the intended route inside `index.html`.

### 3. Blank Page or Missing Assets
- **Check `.nojekyll` exists**: Ensure the empty `.nojekyll` file exists at the repository root. Without `.nojekyll`, GitHub Pages processes files through Jekyll and skips any files or directories starting with an underscore.

---

## 🔍 SEO Maintenance

- **Sitemap Location**: The official XML sitemap lives at `https://linkvm.online/sitemap.xml` (also mirrored in `app-source/public/sitemap.xml`).
- **Google Search Console Submission**: Submit `https://linkvm.online/sitemap.xml` once in Google Search Console under **Sitemaps** for automatic discovery of all public pages (`/`, `/why-free`, `/about`, `/contact`, `/privacy`, `/terms`).
- **Canonical Base URL**: All canonical links, OpenGraph cards, Twitter cards, vector QR codes, and share URLs use `VITE_SITE_URL` as the single source of truth (`https://linkvm.online/`).
- **Real Content Discipline**: Every indexed page renders real, visible content, titles, meta descriptions, and canonical tags (no shadow content, no keyword stuffing, no cloaking). Public profile URLs are resolved dynamically.

---

## 🔐 Authentication & Google Consent Screen Branding

LinkVM supports both Email/Password authentication and Google Sign-In with real security rules.

### Google Cloud OAuth Consent Screen Setup:
To customize the Google Sign-In branding:
1. Open [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **OAuth consent screen**.
2. Set **App name** to `LinkVM`.
3. Set **User support email** and **Developer contact information** (e.g. `aimaeditz.info@gmail.com`).
4. Add authorized domains: `linkvm.online`, `www.linkvm.online`.
5. Verify domain ownership for `linkvm.online` in Google Search Console.

---

## 🔒 License & Credits

Created by **AiMAEditz**. 100% Free Forever with no hidden subscriptions, tiers, or paywalls.
