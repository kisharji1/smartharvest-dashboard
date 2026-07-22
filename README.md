<div align="center">
  <img width="1200" height="475" alt="SmartHarvest Dashboard banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# SmartHarvest Dashboard

<div align="center">

![GitHub repo size](https://img.shields.io/github/repo-size/kisharji1/smartharvest-dashboard)
![GitHub top language](https://img.shields.io/github/languages/top/kisharji1/smartharvest-dashboard)
![GitHub last commit](https://img.shields.io/github/last-commit/kisharji1/smartharvest-dashboard)
![CI](https://github.com/kisharji1/smartharvest-dashboard/actions/workflows/ci.yml/badge.svg)

</div>

SmartHarvest Dashboard is a modern agriculture-focused web application that helps farmers discover crop recommendations, weather insights, AI-assisted farming guidance, and government scheme information from a single dashboard.

## Highlights

- AI Crop Advisor for soil-health-card based recommendations
- Weather & alerts with location search and geolocation support
- AI Assistant for agricultural queries in English or Tamil
- Government schemes explorer
- Voice-command support for navigation

## Tech Stack

- React + Vite
- TypeScript/JavaScript components
- Google GenAI integration
- Node.js backend for local APIs

## Project Structure

- `App.jsx` / `App.tsx` — main application shell and navigation
- `components/` — reusable UI pages and widgets
- `services/` — external API and AI service integrations
- `server/` — local backend and SQLite data access
- `data/` — seeded agriculture scheme data

## Screenshots

<div align="center">
  <img src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" alt="SmartHarvest Dashboard preview" width="900" />
</div>

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A Gemini API key

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy the environment template and add your own key:

```bash
copy .env.example .env.local
```

Then update `.env.local` with your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Run the app locally

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Build for production

```bash
npm run build
```

## Environment Variables

| Variable | Description |
| --- | --- |
| `GEMINI_API_KEY` | API key used by the Gemini AI integration |

## Notes

- Local secrets should stay in `.env.local` and are ignored by Git.
- A safe example file is included as `.env.example` for collaborators.

## License

This project is currently unlicensed. Add a license file if you want to publish it publicly with explicit terms.
