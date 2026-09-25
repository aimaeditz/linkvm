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
- **Security**: Case-insensitive unique handle validation with reserved list checks

---

## 🚀 Deployment Flow & GitHub ⇄ AI Studio Sync

LinkVM is designed as a pure static Single Page Application (SPA) with environment-driven base path resolution, allowing seamless synchronization between local development, Google AI Studio, and production GitHub Pages or custom domains.

### 1. Local Development
Clone the repository and install dependencies:
```bash
npm install
npm run dev
```
The local development server launches at `http://localhost:3000/`.

### 2. Import from GitHub to Google AI Studio
1. In Google AI Studio, select **Import from GitHub** and authorize your repository (`aimaeditz/linkvm`).
2. AI Studio spins up the interactive cloud development container running Vite on port 3000 with real-time preview.

### 3. Edit in Google AI Studio
- Modify components, layouts, or presets.
- All public URLs (sidebar cards, topbar preview, QR codes, share menus, referral links, and invites) dynamically resolve via `getSiteUrl()`.

### 4. Push to Main
Commit and push your changes to the `main` branch on GitHub:
```bash
git add .
git commit -m "feat: updates"
git push origin main
```

### 5. Automated GitHub Pages Deployment (GitHub Actions)
#### One-Time Repository Settings Setup:
1. Navigate to **Repo → Settings → Pages**. Under **Build and deployment**, set **Source** to `GitHub Actions`.
2. Navigate to **Repo → Settings → Actions → General**. Under **Workflow permissions**, choose `Read and write permissions` and click **Save**.

The `.github/workflows/deploy.yml` workflow automatically triggers on every push to `main`:
- Installs dependencies using Node 20.
- Builds the application with `npm run build` using `VITE_BASE_PATH="/linkvm/"` and `VITE_SITE_URL="https://aimaeditz.github.io/linkvm"`.
- Uploads and deploys the static `dist/` bundle to GitHub Pages.
- Publishes automatically at `https://aimaeditz.github.io/linkvm/`.

Deep-linking and browser refreshes on subpaths (e.g., `/dashboard/links`, `/@username`) are handled seamlessly via `public/404.html` and the `index.html` URL restoration script.

### 6. Custom Domain Later (Zero Code Rewrite)
When you acquire a custom domain (e.g., `https://linkvm.online`), switch effortlessly without changing any application code:
1. Go to **Repo → Settings → Pages → Custom domain** and enter your domain name.
2. Configure DNS records at your domain registrar:
   - Four `A` records pointing to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Or a `CNAME` record pointing to `aimaeditz.github.io`.
3. Update your `.env` or GitHub repository variables:
   ```env
   VITE_BASE_PATH="/"
   VITE_SITE_URL="https://linkvm.online"
   ```
4. Commit and push. GitHub Actions rebuilds the app with root routing and publishes directly to your custom domain.

### 7. Optional Vercel Deployment
LinkVM can also be deployed to Vercel in seconds:
1. Import the repository in Vercel.
2. Select Framework Preset: `Vite`.
3. Build Command: `npm run build` (Output Directory: `dist`).
4. Set Environment Variables:
   - `VITE_BASE_PATH="/"`.
   - `VITE_SITE_URL="https://your-project.vercel.app"`.
5. Deploy.

---

## 🔧 Troubleshooting

### 1. 404 Assets (Broken CSS / JavaScript files)
- **Cause**: Assets requested from `/assets/...` instead of `/linkvm/assets/...`.
- **Fix**: Verify `VITE_BASE_PATH="/linkvm/"` in your environment or workflow during GitHub Pages build. When deploying to a custom domain at root, set `VITE_BASE_PATH="/"`.

### 2. Deep-Link 404 (404 Error on Direct Refresh or Direct URL)
- **Cause**: GitHub Pages looks for physical static files matching deep URLs like `/dashboard/links`.
- **Fix**: LinkVM includes `public/404.html` and the SPA redirect restoration script in `index.html`. Ensure `public/404.html` is present in the repository so GitHub Pages routes all fallback requests to the SPA router.

### 3. Workflow Permission Errors (`403 / Resource not accessible by integration`)
- **Cause**: GitHub's default workflow token is set to read-only.
- **Fix**: Open **Settings → Actions → General → Workflow permissions**, select **Read and write permissions**, and click **Save**. Ensure `.github/workflows/deploy.yml` includes `permissions: contents: read, pages: write, id-token: write`.

---

## 🔒 License & Credits

Created by **AiMAEditz**. 100% Free Forever with no hidden subscriptions, tiers, or paywalls.
