# VETBRIDGE

> **Livestock Health Intelligence**  
> AI-powered early disease detection, preventive care, veterinary coordination, and livestock health monitoring.

---

## 📌 Overview

**VETBRIDGE** connects farmers, veterinary officers, and animal husbandry departments on a unified digital healthcare platform. By pairing daily symptom reporting and animal health monitoring with early risk analytics, outbreaks can be identified and contained before they spread across districts.

---

## 🚀 Key Features

- **Farmer Workspace:**
  - Complete livestock census & digital animal health records (tagging, age, breed, vaccination history).
  - Symptom reporting & AI-assisted disease risk screening.
  - Vaccination scheduling and preventive treatment logs.
  - Direct alert notifications and veterinary officer coordination.

- **Veterinarian Workspace:**
  - District caseload overview and triage queues.
  - Tele-consultation requests and symptom assessment reviews.
  - Prescription and treatment protocol management.

- **Government & Admin Surveillance:**
  - District and state-wide disease outbreak heatmaps and analytics.
  - Risk escalation monitoring and inter-agency coordination.
  - Health coverage and vaccination rate tracking.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler & Dev Server:** Vite 8
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **Data Visualizations:** Recharts
- **Icons:** Lucide React
- **Deployment:** Render Blueprint (`render.yaml`)

---

## 💻 Getting Started Locally

### Prerequisites
- **Node.js:** `>= 20.19.0` or `>= 22.12.0` (Node 22 LTS recommended)
- **npm:** `v10+`

### Installation

```bash
# Clone the repository
git clone https://github.com/roshan665/VETBRIDGE.git
cd VETBRIDGE

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

The application will run locally at [http://localhost:5173/](http://localhost:5173/).

### Build for Production

```bash
npm run build
```

Production static assets will be compiled into the `dist/` directory.

---

## ☁️ Deployment on Render

This repository includes a preconfigured Render Blueprint ([render.yaml](render.yaml)):

1. Push your code to GitHub or GitLab.
2. In the [Render Dashboard](https://dashboard.render.com/), click **New +** &rarr; **Blueprint**.
3. Select this repository.
4. Render will automatically detect the static site configuration and deploy it onto the global CDN with client-side SPA routing and asset caching.
