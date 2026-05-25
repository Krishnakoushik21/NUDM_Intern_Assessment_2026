# NUDM Property Tax Dashboard

Built for the NUDM Intern Assessment 2026. The app loads the provided `properties.json` directly in React, so no backend is required.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Add a free API key to `.env`. Groq is preferred when available, and OpenRouter is used as a backup.

```bash
VITE_GROQ_API_KEY=your_groq_key_here
VITE_OPENROUTER_API_KEY=your_key_here
```

## What It Shows

- KPI cards for total, approved, rejected, pending, collection, and approval rate
- City filter that updates all metrics, charts, and the AI assistant
- Revenue and approval pipeline charts
- AI assistant that answers questions using a summarized property analytics dataset
- Recent registrations table with status badges
- Ward collection summary

## Stack

React + Vite, Tailwind CSS v4, Recharts, OpenAI-compatible AI APIs, OpenAI SDK, Lucide icons.

## Structure

```text
src/
  components/
    KPICard.jsx
    TenantFilter.jsx
    CollectionChart.jsx
    ChatAssistant.jsx
    PropertiesTable.jsx
    WardStats.jsx
  utils/
    analytics.js
    aiContext.js
  data/
    properties.json
  App.jsx
```

The `.env` file is git-ignored. Never commit API keys.
