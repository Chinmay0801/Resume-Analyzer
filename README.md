# Resume Analyzer

> **Live ATS resume analysis powered by Claude AI** — Upload your resume, paste a job description, and get your compatibility score, missing keywords, skill gaps, and improved bullet rewrites in seconds.

[![Frontend](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://your-app.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)](https://your-api.onrender.com)
[![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)](https://python.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)

---

## ✨ Features

- 📄 **PDF & DOCX upload** with drag-and-drop
- 🎯 **ATS Compatibility Score** (0–100) with animated ring gauge
- 🔑 **Keyword Gap Analysis** — matched vs. missing keywords
- 📊 **Skill Match Chart** — visual breakdown of required vs. present skills
- ✍️ **Bullet Rewriter** — identifies weak bullets and rewrites them with metrics
- 🔄 **Demo Mode** — works without an API key for portfolio demos

---

## 🏗️ Architecture

```
┌─────────────────────┐    HTTP POST /analyze    ┌──────────────────────────┐
│   Next.js Frontend  │ ──────────────────────▶  │   FastAPI Backend        │
│   (Vercel)          │                           │   (Render)               │
│                     │ ◀──────────────────────   │                          │
│  Drag-drop upload   │    JSON Analysis Result   │  PDF/DOCX extraction     │
│  Score ring         │                           │  Claude claude-sonnet-4-5│
│  Skill chart        │                           │  Structured JSON prompt  │
│  Suggestions panel  │                           │                          │
└─────────────────────┘                           └──────────────────────────┘
```

---

## 🚀 Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+
- (Optional) Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY (leave blank for demo mode)
uvicorn main:app --reload
# API runs at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### Frontend

```bash
cd frontend
npm install
# Create .env.local:
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
npm run dev
# App runs at http://localhost:3000
```

---

## 🌐 Deployment

### Backend → Render

1. Push this repo to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Point it to the `backend/` directory
4. Set env vars: `ANTHROPIC_API_KEY`, `ALLOWED_ORIGINS` (your Vercel URL)
5. Build command: `pip install -r requirements.txt`
6. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend → Vercel

1. Import the repo on [vercel.com](https://vercel.com)
2. Set Root Directory to `frontend/`
3. Add env var: `NEXT_PUBLIC_API_URL=https://your-api.onrender.com`
4. Deploy

---

## 🧪 API Reference

### `POST /analyze`

| Field | Type | Description |
|-------|------|-------------|
| `file` | File | Resume PDF or DOCX |
| `job_description` | string | Full JD text |

**Response:**
```json
{
  "ats_score": 78,
  "summary": "...",
  "matched_keywords": ["Python", "REST API"],
  "missing_keywords": ["Docker", "Kubernetes"],
  "skills_required": [{ "skill": "Docker", "present": false }],
  "weak_bullets": [{
    "original": "Worked on backend",
    "issue": "Too vague",
    "rewrite": "Engineered 3 microservices..."
  }],
  "is_demo": false
}
```

---

## 📁 Project Structure

```
Resume_Analyzer/
├── backend/
│   ├── main.py          # FastAPI app + endpoints
│   ├── extractor.py     # PDF/DOCX text extraction
│   ├── analyzer.py      # Claude API + demo mode
│   ├── requirements.txt
│   ├── render.yaml      # Render deploy config
│   └── .env.example
├── frontend/
│   ├── app/             # Next.js 14 App Router pages
│   ├── components/      # UI components
│   ├── lib/             # API client
│   ├── types/           # TypeScript types
│   └── vercel.json
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript |
| Styling | Vanilla CSS (dark glassmorphism) |
| Animations | Framer Motion |
| Charts | Recharts |
| Backend | FastAPI, Python 3.11+ |
| LLM | Anthropic Claude (claude-sonnet-4-5) |
| PDF parsing | pdfplumber |
| DOCX parsing | python-docx |
| Frontend deploy | Vercel |
| Backend deploy | Render |

---

*Built to solve a real placement problem — tested on real JDs from target companies.*
