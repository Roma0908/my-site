# System Architecture

## Separation of Concerns
All AI engines are implemented as **pure, deterministic TypeScript modules** inside `src/ai/` with zero dependencies on React, DOM APIs, or external ML packages.

1. **Data Layer (`src/data/`):** Static JSON schemas (`careers.json`, `bayes_cpt.json`) validated at test time.
2. **AI Engine Layer (`src/ai/`):**
   - `bayes/`: Exact inference over $2^4 = 16$ latent binary aptitude states.
   - `ml/`: Seeded PRNG (`Mulberry32`) synthetic generator + full-batch Softmax Gradient Descent executed inside a dedicated Web Worker (`src/ai/ml/worker.ts`).
   - `csp/`: Constraint solver mapping learning modules to weekly slots $1 \dots N$.
3. **State & Persistence (`src/state/`):** React Context (`AppContext.tsx`) synchronizing user profile, skill progression, and snapshots to `localStorage` with JSON import/export.
4. **Presentation Layer (`src/pages/`):** Responsive Tailwind CSS + Recharts views supporting Kazakh, Russian, and English.
