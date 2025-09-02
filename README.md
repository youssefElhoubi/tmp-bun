# 📊 Track My Prices (TMP)

[![Bun.js](https://img.shields.io/badge/runtime-bun.js-ffde57?logo=bun&logoColor=black)](https://bun.sh)
[![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Supabase](https://img.shields.io/badge/backend-Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Track My Prices (TMP)** is a **modern web application** that helps users keep track of product prices across multiple platforms.  
It allows users to **add products via a URL**, automatically **scrapes product details**, and shows **price changes over time**.  
Built with **Bun.js** for performance, it’s designed to be **lightweight, scalable, and fast**.  

---

## 📖 Table of Contents
- [✨ Features](#-features)
- [📚 Motivation & Use Cases](#-motivation--use-cases)
- [🛠 Tech Stack](#-tech-stack)
- [📂 Project Structure](#-project-structure)
- [⚙️ Installation & Setup](#️-installation--setup)
- [📡 API Endpoints](#-api-endpoints)
- [🚧 Roadmap](#-roadmap)
- [📸 Screenshots & Demo](#-screenshots--demo)
- [🤝 Contributing](#-contributing)
- [❓ FAQ](#-faq)
- [📜 License](#-license)

---

## ✨ Features

- 🔍 **Product Tracking** – Add products via URL; the system scrapes name, price, and platform.  
- 📈 **Price History** – Track historical price changes over time.  
- 🏪 **Cross-Platform Comparison** – Compare the same product across different sellers.  
- 🔔 **Notifications** – Get email or in-app alerts when prices drop.  
- 👥 **Community Tracking** – Discover products tracked by other users.  
- 🛠 **Admin Tools** – Suspend accounts, manage products, and moderate activity.  
- 🌍 **Scalable** – Designed for growth with Supabase & PostgreSQL.  

---

## 📚 Motivation & Use Cases

Why does **TMP** exist?  
- Online shoppers want to **save money** by waiting for the best deals.  
- People waste time manually checking multiple websites.  
- Existing tools often lock features behind premium plans.  

**TMP** solves this by:  
✅ Providing **free, open-source price tracking**.  
✅ Allowing **community-driven product tracking**.  
✅ Using **lightweight, modern tech (Bun.js)** for better performance.  

Example Use Cases:  
- 💻 Tech enthusiast tracking **laptop prices** across Amazon & eBay.  
- 👟 Sneaker collector monitoring **limited edition shoes** for price drops.  
- 📚 Student comparing **book prices** across different online stores.  

---

## 🛠 Tech Stack

- **Runtime:** [Bun.js](https://bun.sh/) ⚡ Ultra-fast JS/TS runtime  
- **Framework:** Express.js or NestJS (running on Bun)  
- **Database:** PostgreSQL via [Supabase](https://supabase.com/)  
- **Scraping:** Puppeteer (optimized for Bun)  
- **Frontend (Planned):** React / Next.js  
- **Authentication:** JWT  
- **Deployment:** Docker + Supabase + Vercel (planned)  

---

## 📂 Project Structure

```bash
track-my-prices/
├── src/
│   ├── controllers/    # Request handlers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Core logic (scraping, price tracking)
│   └── utils/          # Helpers (validation, JWT, etc.)
├── tests/              # Unit & integration tests
├── .env.example        # Example environment variables
├── bun.lockb           # Bun lockfile
├── package.json
└── README.md
