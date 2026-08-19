# Aero & Stay Kenya ✈️ 🏨
### Private Flight + Luxury Stay Concierge Booking Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![M-Pesa](https://img.shields.io/badge/M--Pesa-Daraja_Ready-00A859?style=for-the-badge)](https://developer.safaricom.co.ke/)

A full-stack, bespoke luxury concierge booking platform built for high-end domestic travel in Kenya. It connects private flights from Nairobi (Wilson Airport & JKIA) to coastal gems (Diani, Lamu, Watamu) and safari plains (Maasai Mara, Samburu) with vetted luxury villas, Swahili heritage estates, and private bush suites into a single seamless reservation.

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
- **Styling**: Tailwind CSS + Glassmorphism + Bespoke Luxury Safari & Gold Tokens
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti
- **Storage**: Persistent JSON & In-Memory Store Layer (Extendable to Supabase / PostgreSQL / Prisma)
- **Payments**: Safaricom M-Pesa STK Push & Card Gateway Workflow
- **Communication**: WhatsApp Direct API (`wa.me`) integration

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+ or 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd robby

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build & Production Run

```bash
npm run build
npm run start
```

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
