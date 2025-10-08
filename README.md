# Weather Web Application

A React + Vite frontend that renders Stockholm's hourly weather forecast using SMHI's open data. The UI shows 24 hours of local time, Swedish labels/icons, and gracefully handles API errors with retry support. GitHub Pages deploys the production build whenever `main` is updated.

## Prerequisites

- Node.js 20 (matching the CI workflow)
- npm 10+

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173` with hot-reload enabled.

## Available Scripts

| Command           | Purpose |
| ----------------- | ------- |
| `npm run dev`     | Start Vite dev server in development mode |
| `npm run build`   | Generate production bundle in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test`        | Run vitest unit/integration suites |
| `npm run lint`    | Check code quality via ESLint |

## Testing

Vitest + Testing Library cover layout, symbol mapping, error states, accessibility, and helper utilities. Run all suites:

```bash
npm test
```

## Deployment

GitHub Actions builds and publishes to the `gh-pages` branch on every push to `main` (see `.github/workflows/gh-pages.yml`). To finish setup:

1. In repository settings → Pages, select branch `gh-pages`.
2. After the workflow succeeds, the site is served from `https://<username>.github.io/Weather-webb-application-/`.

Manual deployment (if ever needed):

```bash
npm run build
npx gh-pages -d dist
```

## Project Structure

```
src/
  App.jsx          # Root component building the layout and table
  assets/          # Weather icons
  index.css        # Global styles
  ...
tests/             # Vitest suites for layout, symbols, error handling, etc.
```

## Error Handling

- Renders placeholders immediately for slow networks.
- Fetch failures display `Kunde inte hämta prognos.` and a retry button.

## License

This project is available under the MIT License (see `LICENSE`).
