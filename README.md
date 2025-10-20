# Uncool Math Games

Inspired by “Cool Math Games,” redesigned to be more stimulating and modern. This repo currently focuses on the site structure, pages, styling, and navigation. Game implementations will be added in later milestones.

---

## Table of Contents
- [Project Goals](#project-goals)
- [Team](#team)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pages & Routing](#pages--routing)
- [Accessibility & UX](#accessibility--ux)
- [Coding Standards](#coding-standards)
- [Milestones & Weekly Log](#milestones--weekly-log)
- [Roadmap (Next Up)](#roadmap-next-up)
- [Contributing](#contributing)
- [License](#license)

---

## Project Goals
- Build a multi-page front end (Home, Games, Account, Leaderboard, etc.).
- Provide a clean, responsive UI with consistent styling and simple navigation.
- Prepare hooks for future auth and scores/leaderboard features.
- Keep codebase simple (vanilla HTML/CSS/JS).

---

## Team
- **Phat Duong**
- **Jose Espinoza**
- **Elmer Castellanos**
- **Guillermo Diaz**

---

## Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript (no framework)
- **Tooling:** VS Code + Live Server
- **Design:** Simple component/card patterns, CSS Grid/Flexbox

> Note: We may evaluate React/Bootstrap later; current milestone remains vanilla HTML/CSS/JS.

---

## Getting Started
1. Clone the repo.
2. Open in VS Code.
3. Install and use Live Server.
4. Navigate to `http://localhost:5500/` (port may vary) and open `index.html`.

---

## Development Workflow
- **Branching:** `main` (stable) → feature branches (`feat/navbar`, `feat-pages`, etc.)
- **Commits:** Short, imperative messages

---

## Pages & Routing
- `/index.html` — Landing/Home
- `/games/` — (placeholder folder for future game pages)
- `/account/` — (optional future: login/signup/profile)
- `/leaderboard/` — (optional future: static layout first, API later)

**Navigation:** Header links should be present and functional, even if some pages are placeholders.

---

## Accessibility & UX
- Provide alt text for images and meaningful link labels.
- Maintain color contrast and readable font sizes.
- Keyboard navigable: focus states visible; avoid click-only interactions.
- Use semantic HTML: `<header> <main> <section> <nav> <footer>`.

---

## Coding Standards
**HTML**
- Semantic structure; descriptive titles and meta tags.
- Use consistent indentation.

**CSS**
- Keep tokens consistent (colors, spacing, border-radius).
- Prefer utility classes and small components over large monoliths.

**JavaScript**
- Keep `scripts/main.js` lightweight for Week 4 (no game logic yet).

---

## Milestones & Weekly Log
**Week 1–2**
- Project kickoff, proposal, roles, initial scope.
- Draft site map and page list.

**Week 3**
- Base layout and styling decisions (cards, grid, nav).
- Decide MVP stack (vanilla HTML/CSS/JS).

**Week 4 (Current)**
-  Home page skeleton and shared styles.
-  Header/nav with working links (placeholders allowed).
-  Repository structure aligned with future pages.
-  `public/js/main.js` added.
-  README.md committed.

> Keep this section updated as we complete items.

---

## Roadmap (Next Up)
- Add `public/js/main.js` with minimal site-wide behavior (no game logic).
- Create placeholder pages: `/leaderboard/`, `/account/`.
- Document API stubs (scores/auth) for later integration.

---

```
umg/
├─ .github/                                                          [Owner: Elmer Castellanos]
│  ├─ ISSUE_TEMPLATE/                                                [Owner: Elmer Castellanos]
│  │  ├─ bug.md                                                      [Owner: Elmer Castellanos]
│  │  └─ task.md                                                     [Owner: Elmer Castellanos]
│  └─ pull_request_template.md                                       [Owner: Elmer Castellanos]
├─ .vscode/                                                          [Owner: Guillermo Diaz]
│  └─ settings.json                                                  [Owner: Guillermo Diaz]
├─ docs/                                                             [Owner: Elmer Castellanos]
│  └─ proposal.pdf                                                   [Owner: Elmer Castellanos]
├─ public/                           # (Vite static assets, optional) [Owner: Guillermo Diaz]
│  └─ assets/                                                            [Owner: Guillermo Diaz]
├─ src/                                                                [Owner: Guillermo Diaz]
│  ├─ assets/                                                          [Owner: Guillermo Diaz]
│  ├─ routes/                                                          [Owner: Guillermo Diaz]
│  │  ├─ Home.tsx                                                      [Owner: Guillermo Diaz]
│  │  ├─ Leaderboard.tsx                                               [Owner: Guillermo Diaz]
│  │  └─ Account.tsx                                                   [Owner: Guillermo Diaz]
│  ├─ App.tsx                                                          [Owner: Guillermo Diaz]
│  └─ main.tsx                                                         [Owner: Guillermo Diaz]
├─ index.html                      # Vite app entry                    [Owner: Guillermo Diaz]
├─ vite.config.ts                  # Dev proxy / build config          [Owner: Guillermo Diaz]
├─ tsconfig.json                                                       [Owner: Guillermo Diaz]
├─ package.json                   # scripts & deps (app + api)         [Owners: Guillermo Diaz, Phat Duong]
├─ README.md                                                           [Owner: Elmer Castellanos]
├─ CONTRIBUTING.md                                                     [Owner: Elmer Castellanos]
├─ CODEOWNERS                                                          [Owner: Elmer Castellanos]
├─ .gitignore                                                          [Owner: Elmer Castellanos]
├─ .env.example                    # PORT, DATABASE_URL                [Owner: Phat Duong]
├─ docker-compose.yml              # Postgres (+ optional pgAdmin)     [Owner: Phat Duong]
├─ server/                                                             [Owner: Phat Duong]
│  ├─ server.js                    # Express (/health, /db/health)     [Owner: Phat Duong]
│  ├─ sql/                                                             [Owner: Jose Espinoza]
│  │  ├─ 001_schema.sql            # users, games, scores              [Owner: Jose Espinoza]
│  │  └─ 002_seed.sql              # guest + sample games              [Owner: Jose Espinoza]
│  └─ scripts/                                                         [Owner: Jose Espinoza]
│     └─ db-apply.js               # runs SQL files in order           [Owner: Jose Espinoza]

```
---

## Contributing
1. Open an issue describing the change.
2. Create a branch from `main`.
3. Commit small, atomic changes.

---

## Educational project
