# LinkVM — All Your Links. One Unified Page.

> **100% Free Forever Creator Bio Platform**  
> *Created by AiMAEditz*

LinkVM is a blazing-fast, modern, and privacy-conscious link-in-bio platform built for creators, developers, artists, and businesses.

---

## ✨ Features

- 🔗 **Unlimited Links**: Add, reorder, customize, and animate unlimited bio links with Lucide icons.
- 🎨 **34 Free Theme Presets**: Handcrafted color schemes, typography, corner radiuses, and glass/solid/gradient buttons across 6 categories.
- 🔒 **Username Uniqueness System**: Case-insensitive database enforcement, reserved word filtering, real-time debounced availability scanning.
- 📊 **Real-Time Analytics**: Track views, clicks, CTR conversions, referrer sources, and device distribution with zero invasive third-party trackers.
- 📱 **Vector QR Code Suite**: Generate customizable vector SVG and ultra-high-resolution PNG QR codes with embedded center marks.
- ⚡ **Auto-Saving & Offline Resilient**: Instant debounced updates across all profile, theme, and link attributes.
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

## 🌐 Custom Domain (Later)

When you are ready to connect a custom domain (e.g., `https://linkvm.online`):
1. Add a `CNAME` file at the repository root containing your domain (e.g. `linkvm.online`).
2. Update `VITE_SITE_URL` in `.env` (or environment) to `https://linkvm.online`.
3. In `app-source/vite.config.ts`, change `base` to `'/'`.
4. Rebuild to root:
   ```bash
   cd app-source && npm run build:root
   ```
5. Commit and push:
   ```bash
   git add . && git commit -m "Configure custom domain" && git push origin main
   ```
6. In GitHub **Settings → Pages → Custom domain**, enter your domain name and save.

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

## 🔒 License & Credits

Created by **AiMAEditz**. 100% Free Forever with no hidden subscriptions, tiers, or paywalls.
