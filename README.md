# OneAtlas — AI Model Intelligence Platform

A full-stack AI model discovery and comparison platform. Search, filter, and compare AI models from leading providers including OpenAI, Anthropic, Google DeepMind, Meta, Mistral, DeepSeek, xAI, and more.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Backend | Next.js API Routes |
| ORM | Prisma 6 |
| Database | PostgreSQL (Neon) |
| Icons | Lucide React |
| Deployment | Vercel + Neon |

---

## Features

- 🔍 **Model Discovery** — Search and filter 20+ AI models by name, provider, category, and capabilities
- 📊 **Model Detail Pages** — Full specs, pricing, context window, capabilities, modalities, and benchmark scores
- ⚖️ **Model Comparison** — Side-by-side comparison of up to 3 models
- 🏆 **Rankings Leaderboard** — Models ranked by benchmark performance (MMLU, HumanEval, MATH, GPQA, SWE-bench)
- 🏢 **AI Labs Directory** — Research organizations with model counts and descriptions
- 🔌 **Provider Directory** — API providers with capabilities and model availability
- 📱 **Responsive Design** — Works on mobile, tablet, and desktop

> **Note**: All benchmark scores are demo data for illustration purposes only and are not independently verified.

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── models/        # GET /api/models, GET /api/models/[id]
│   │   ├── providers/     # GET /api/providers, GET /api/providers/[id]
│   │   ├── labs/          # GET /api/labs
│   │   ├── rankings/      # GET /api/rankings
│   │   ├── benchmarks/    # GET /api/benchmarks
│   │   └── search/        # GET /api/search
│   ├── models/[id]/       # Model detail page
│   ├── compare/           # Comparison page
│   ├── rankings/          # Leaderboard page
│   ├── labs/              # AI Labs directory
│   ├── providers/         # Provider directory
│   ├── layout.tsx
│   └── page.tsx           # Homepage
├── components/
│   ├── Navbar.tsx
│   ├── ModelCard.tsx
│   ├── LoadingStates.tsx
│   └── EmptyState.tsx
└── lib/
    └── prisma.ts          # Singleton Prisma client
prisma/
├── schema.prisma          # Full relational schema
└── seed.ts                # 20 models, 9 labs, 6 providers, 5 benchmarks
```

---

## Database Schema

```
Lab         (id, name, slug, description, website, country, foundedYear)
Provider    (id, name, slug, description, website, capabilities[])
AIModel     (id, name, slug, category, inputPrice, outputPrice, contextWindow,
             releaseDate, capabilities[], modalities[], isOpenSource, labId)
ProviderModel (providerId, modelId)  — many-to-many
Benchmark   (id, name, slug, description, category, maxScore)
BenchmarkScore (modelId, benchmarkId, score, isDemo)
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- A Neon (or other PostgreSQL) database

### 1. Clone and install

```bash
git clone <your-repo-url>
cd oneatlas
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env and paste your DATABASE_URL from Neon
```

### 3. Set up database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (or use migrate)
npm run db:push

# Seed with sample data
npm run db:seed
```

### 4. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

---

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/models` | GET | List models with search, filter, sort, pagination |
| `/api/models/[id]` | GET | Full model detail by ID or slug |
| `/api/providers` | GET | All API providers with model counts |
| `/api/providers/[id]` | GET | Provider detail with model list |
| `/api/labs` | GET | All research labs with model counts |
| `/api/rankings` | GET | Models ranked by benchmark score |
| `/api/benchmarks` | GET | Benchmark definitions |
| `/api/search` | GET | Global search across models, labs, providers |

### Query Parameters — `/api/models`

| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Search query |
| `category` | string | Filter by category (Chat, Reasoning, Multimodal) |
| `lab` | string | Filter by lab slug |
| `capability` | string | Filter by capability |
| `sort` | string | Sort by: `name`, `inputPrice`, `outputPrice`, `contextWindow`, `releaseDate` |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 12, max: 50) |

---

## Deployment to Vercel

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial OneAtlas commit"
git remote add origin https://github.com/YOUR_USERNAME/oneatlas.git
git push -u origin main
```

### Step 2 — Import to Vercel
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Framework: **Next.js** (auto-detected)

### Step 3 — Add Environment Variables
In Vercel Project Settings → Environment Variables:
```
DATABASE_URL = <your Neon connection string>
```

### Step 4 — Set Build Command
In Vercel Project Settings → Build & Output Settings:
```
Build Command: npx prisma generate && next build
```

### Step 5 — Deploy
Click **Deploy**. After first deploy, run seed from your local machine:
```bash
npm run db:seed
```

---

## Seed Data Included

| Category | Count |
|----------|-------|
| AI Models | 20 |
| Research Labs | 9 |
| API Providers | 6 |
| Benchmarks | 5 |
| Benchmark Scores | 100 (demo data) |

**Models included**: GPT-4.1, GPT-4o, GPT-4o mini, o3, o4-mini, Claude Sonnet 4, Claude Opus 4, Claude 3.5 Haiku, Gemini 2.5 Pro, Gemini 2.0 Flash, Gemini 1.5 Flash, Llama 4 Maverick, Llama 3.3 70B, DeepSeek R1, DeepSeek V3, Mistral Large 2, Mixtral 8x22B, Grok 3, Qwen2.5 72B, Command R+

---

## Demo Video Talking Points

1. **Homepage** — Search for "GPT", show filtering by category "Reasoning", sort by context window
2. **Model Cards** — Show pricing, context window, capabilities chips, compare button
3. **Model Detail** — Click into Claude Sonnet 4 — show full specs, benchmark scores with score bars
4. **Compare** — Select 3 models → click "Compare Now" → show side-by-side table
5. **Rankings** — Switch between MMLU / HumanEval / MATH benchmarks, filter by category
6. **Labs** — Show the labs grid, model count badges, website links
7. **Providers** — Show OpenRouter with 15+ models available

---

© 2026 OneAtlas. AI Model Intelligence Platform.
