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

- **Framework**: React 19 / Next.js / Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Validation**: Zod
- **Database & Schemas**: Prisma ORM with PostgreSQL
- **Security**: Case-insensitive unique handle validation with reserved list checks

---

## 🌐 Switching to a Custom Domain

When you purchase or attach a custom domain (e.g., `https://linkvm.online`), follow these simple drop-in steps:

1. Update `.env.example` and your production deployment environment variables:
   ```env
   NEXT_PUBLIC_APP_URL="https://linkvm.online"
   NEXTAUTH_URL="https://linkvm.online"
   ```
2. Redeploy the application. All public URLs, QR code links, share menus, meta tags, and sitemaps automatically read from `getSiteUrl()` using `process.env.NEXT_PUBLIC_APP_URL`.
3. Configure your DNS provider A / CNAME records pointing to your Vercel or Node hosting server.

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run the local development server
npm run dev

# Build for production
npm run build
```

---

## 🔒 License & Credits

Created by **AiMAEditz**. 100% Free Forever with no hidden subscriptions, tiers, or paywalls.
