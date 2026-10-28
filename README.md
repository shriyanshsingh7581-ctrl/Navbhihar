# NaviBihar India (NBI News) — Premium Mobile-First Digital News Portal

Official digital news platform for **NaviBihar India (NBI News)** built with **React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, and Firebase (Authentication & Cloud Database)**, ready for direct deployment on **Vercel**.

---

## Key Features

- **Brand Identity**: Uses the official circular **NaviBihar India (NBI News)** logo across the header, mobile navigation drawer, article bylines, footer, favicon, and social OpenGraph cards.
- **Mobile-First Experience**:
  - Compact sticky mobile header (`52px`) and fixed 5-tab bottom navigation bar (`Home`, `Latest`, `Categories`, `Videos`, `Search`) with $\ge 44\text{px}$ touch targets.
  - Horizontally scrollable Hindi category navigation bar (`होम`, `बिहार`, `भारत`, `राजनीति`, `क्राइम`, `शिक्षा`, `रोजगार`, `खेल`, `मनोरंजन`, `टेक्नोलॉजी`, `बिजनेस`, `वायरल`).
  - Red Breaking News ticker strip (`BREAKING NEWS | बिहार और देश की ताज़ा खबरें`).
- **Editorial Front Page**:
  - Featured Hero News, Latest News (`ताज़ा खबरें`), Trending / Most Read (`सबसे ज्यादा पढ़ी जाने वाली खबरें`), Dedicated Bihar Special Section (`बिहार की ताज़ा खबरें`, `बिहार राजनीति`, `बिहार शिक्षा`, `बिहार रोजगार`, `बिहार क्राइम`, `बिहार के प्रमुख शहरों की खबरें`), Video News with 16:9 and 9:16 vertical mobile shorts, and 8 category blocks.
- **Article Detail Page (`/news/:slug`)**:
  - Hindi typography size controls (`अ`, `अ+`, `अ++`), WhatsApp / Facebook / X sharing, Copy Link confirmation, breadcrumbs, related news, and Previous/Next article navigation.
- **Newsroom Admin Panel (`/admin`)**:
  - Protected via Firebase Google Authentication (`signInWithPopup`).
  - Create, edit, schedule, draft, and delete news articles, manage video bulletins, manage categories, and update the breaking news ticker and social links.
- **Complete SEO & Structured Data**:
  - Dynamic `<title>`, meta description, OpenGraph, Twitter Cards, canonical URLs, `NewsArticle` + `BreadcrumbList` JSON-LD schema, `/robots.txt`, and `/sitemap.xml`.

---

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables (Optional override)**:
   Copy `.env.example` to `.env.local` if you want to override the bundled `firebase-applet-config.json` or configure Cloudinary image uploads:
   ```bash
   cp .env.example .env.local
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## Deploying to Vercel

This project includes a production-ready `vercel.json` that configures SPA routing so direct links to `/news/:slug`, `/category/:slug`, `/videos`, `/search`, and `/admin` work seamlessly on refresh without 404 errors.

1. Push this repository to GitHub / GitLab / Bitbucket.
2. Import the project in **Vercel** (`https://vercel.com/new`).
3. Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. (Optional) Add environment variables from `.env.example` in **Vercel Project Settings -> Environment Variables**.
5. In your **Firebase Console -> Authentication -> Settings -> Authorized domains**, add your `.vercel.app` domain and custom domain so Google Sign-In works in production.
