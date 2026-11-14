# CareerPath AI

Offline-capable AI Career & Skill Development Planner for school and university students in Kazakhstan. Built as a final project for the university **AI Fundamentals** course using pure TypeScript algorithms (no external ML libraries or cloud APIs).

## Quick Start

```bash
npm install
npm run dev      # Start local dev server at http://localhost:5173
npm test         # Run Vitest unit & algorithm verification suite
npm run build    # Production bundle for Vercel / static hosting
```

## Project Structure

- `src/ai/bayes/` — Exact inference by enumeration on a 3-layer discrete Bayesian Network + CPT validator.
- `src/ai/ml/` — Seeded synthetic dataset generator, Multinomial Logistic Regression (Softmax + L2), k-NN baseline, and Web Worker trainer.
- `src/ai/csp/` — Study plan Constraint Satisfaction Problem solver (MRV + Degree heuristic + Forward Checking + Plain Backtracking + conflict diagnostics).
- `src/data/` — 12 Kazakhstan-relevant careers, expert-estimated CPTs, and 3 demo student presets.
- `src/i18n/` — Kazakh (`kk`), Russian (`ru`), and English (`en`) localization dictionaries.
- `src/pages/` — 10 interactive views including Bayes Explorer, ML Model Lab, and CSP Visualizer.
- `docs/` — Architecture, algorithm specifications, test metrics, AI usage, and team contribution templates.
