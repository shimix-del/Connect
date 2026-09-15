# Aero & Stay Kenya ✈️ 🏨
### Private Flight + Luxury Stay Concierge Booking Platform

[![GitHub Pages](https://github.com/shimix-del/Connect/actions/workflows/deploy-pages.yml/badge.svg)](https://shimix-del.github.io/Connect/)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/shimix-del/Connect)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=shimix-del/Connect)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/shimix-del/Connect)
[![CI/CD Pipeline](https://github.com/shimix-del/Connect/actions/workflows/ci.yml/badge.svg)](https://github.com/shimix-del/Connect/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Docker Ready](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://github.com/shimix-del/Connect/pkgs/container/connect)

A full-stack, bespoke luxury concierge booking platform built for high-end domestic travel in Kenya. It connects private flights from Nairobi (Wilson Airport & JKIA) to coastal gems (Diani, Lamu, Watamu) and safari plains (Maasai Mara, Samburu) with vetted luxury villas, Swahili heritage estates, and private bush suites into a single seamless reservation.

---

## 🚀 1-Click Go Live & Deployment Options

### 🟢 1. Go Live on GitHub Pages (Direct from GitHub)
You can deploy and host the site live on GitHub at `https://shimix-del.github.io/Connect/` with 1 click:

1. In your GitHub repository, go to **[Actions > Deploy to GitHub Pages](https://github.com/shimix-del/Connect/actions/workflows/deploy-pages.yml)**.
2. Click **Run workflow** > select `main` > click **Run workflow**.
3. Once completed (approx. 45s), your site is live at:
   👉 **`https://shimix-del.github.io/Connect/`**
4. *(One-time setup in GitHub settings)*: Go to **Settings** > **Pages** > under **Build and deployment** select **Source: GitHub Actions**.

---

### ⚡ 2. Run Directly in GitHub Browser (Codespaces)
1. Click **[Open in GitHub Codespaces](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=shimix-del/Connect)**.
2. GitHub launches the full dev server in the cloud and opens port 3000 in your browser.

---

### 🌐 3. Deploy Live with Vercel (Recommended Serverless Hosting)
1. Click **[Deploy with Vercel](https://vercel.com/new/clone?repository-url=https://github.com/shimix-del/Connect)**.
2. Select your repository `shimix-del/Connect` and click **Deploy**.
3. In under 1 minute, your site is live on a custom `.vercel.app` domain with full backend API support.

---

### 🐳 3. Run with Docker & GitHub Container Registry (GHCR)

The repository includes a production multi-stage `Dockerfile` and automated publishing to GitHub Container Registry.

#### Using Docker Compose:
```bash
# Clone the repository
git clone https://github.com/shimix-del/Connect.git
cd Connect

# Spin up the container with persistent storage
docker compose up -d
```
Access the application at `http://localhost:3000`.

#### Pull & Run directly from GitHub Packages (GHCR):
```bash
docker pull ghcr.io/shimix-del/connect:latest
docker run -p 3000:3000 -v $(pwd)/data:/app/.data ghcr.io/shimix-del/connect:latest
```

---

### 🔄 4. Automated GitHub Actions CI/CD

On every `push` and `pull_request` to `main`, GitHub Actions automatically:
- Checks out the code and sets up Node.js 20 with dependency caching.
- Runs ESLint validation (`npm run lint`).
- Runs Next.js production compilation (`npm run build`).
- Builds and publishes the Docker image to GitHub Container Registry (on push).

See workflows in [`.github/workflows/`](.github/workflows/).

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 18.17+ or 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/shimix-del/Connect.git
cd Connect

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Build & Production Run

```bash
npm run build
npm run start
```

---

## 🌟 Key Features

### 1. High-End Public Website & Booking Studio
- **Curated Multi-Step Request Engine**: Choose between **Flight + Luxury Stay**, **Flight Only**, or **BnB / Stay Only**.
- **Domestic Air Corridors**: Real route schedules and pricing for *Kenya Airways*, *Safarilink*, *Skyward Express*, *Jambojet*, *AirKenya*, and *Governors Aviation*.
- **Vetted Property Portfolio**: Curated beachfront villas in Diani Beach, 18th-century Swahili stone houses in Lamu Shela, forest glasshouses in Karen, and private safari suites in the Maasai Mara.
- **Concierge VIP Touches**: Chauffeured airstrip transfers, private coastal seafood chefs, and welcome champagne.

### 2. Human-in-the-Loop Operations & Quoting Desk (`/admin`)
- **Real-Time Request Pipeline**: Track requests across 5 lifecycle stages (*Pending Review*, *Quoted*, *Payment Pending*, *Confirmed*, *Completed*).
- **Interactive Quoting Engine**: Calculate real airfares, villa rates, and concierge margins with instant **KES & USD** conversions.
- **One-Click WhatsApp Dispatch**: Generates pre-formatted luxury WhatsApp links (`wa.me/+254...`) with custom quote breakdowns and live tracking links.
- **PNR & Ticket Issuer**: Issue airline booking references, baggage allowances, terminal details, and stay vouchers.
- **Master Inventory Manager**: Add/edit curated stays and flight routes with private host contacts.
- **Trips Operations Calendar**: Visual calendar of upcoming air departures and villa check-ins.
- **Client CRM**: Maintain notes, VIP tiers, and past trip histories for repeat high-net-worth clients.

### 3. Client Live Tracking & Seamless Checkout (`/track/[code]`)
- **Real-Time Timeline**: Step-by-step visibility from request submission to trip completion.
- **Itemized Package Review**: Transparent quote breakdown with validity hold countdowns.
- **Safaricom Lipa na M-Pesa STK Push Simulator**: Realistic phone prompt simulator with 4-digit PIN verification and official receipt generation.
- **Card Gateway Checkout**: 256-bit TLS encrypted card checkout supporting Visa, Mastercard, and Amex.
- **Printable & PDF-Ready Luxury Itinerary**: Official boarding pass + stay voucher with QR code verification, host contacts, and 24/7 concierge WhatsApp hotline.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Glassmorphism + Bespoke Safari & Gold Tokens
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti
- **Storage**: Persistent JSON & In-Memory Store Layer (Extendable to Supabase / PostgreSQL / Prisma)
- **Payments**: Safaricom M-Pesa STK Push & Card Gateway Workflow
- **Communication**: WhatsApp Direct API (`wa.me`) integration
- **CI/CD & Containers**: GitHub Actions, GitHub Codespaces, Docker, GHCR

---

## 🧭 Page Routes Map

| Route | Description |
| :--- | :--- |
| `/` | Luxury Public Homepage with Discovery Showcases & Booking Engine |
| `/request` | Dedicated Full-Screen Booking Request Studio |
| `/stays` | Curated Vetted Stays & Luxury Villas Catalog |
| `/routes` | Domestic Flight Corridors & Carrier Schedules Directory |
| `/track` | Client Reference Code Lookup (`KEN-XXXXX`) |
| `/track/[code]` | Client Live Tracking, Itemized Quote Review, M-Pesa/Card Checkout & Itinerary |
| `/admin` | Master Operations Dashboard, Requests Pipeline & Quoting Drawer |
| `/admin/inventory` | Curated Stays & Flight Routes Management |
| `/admin/calendar` | Trips & Check-In Operations Calendar |
| `/admin/clients` | High-End Client CRM & VIP Relationship Profiles |

---

## 📄 License
MIT License. Built for luxury travel & concierge services in Kenya.
