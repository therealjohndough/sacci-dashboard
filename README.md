# House of Sacci — Dashboards

Internal dashboards for House of Sacci. Built with **Vite + React**, deployed to
**Cloudflare Pages** at **`dashboard.sacci.space`**.

First app: the **Vendor Dashboard by Project** (Cilicon, Archibald, orders by project).
It replaces the old static Claude artifact — instead of anyone hand-editing HTML, you
edit **one data file** and the live site rebuilds itself.

> Long-term this folds into the `sacci-platform` monorepo described in
> `sacci-kb/architecture/repo-strategy.md` (as an `apps/exec` surface). Until the
> Supabase `ops_projects` model is ready, this lean repo is the live home.

---

## How to update it live (the whole point)

**All the content lives in one file:** [`src/data/vendors.json`](src/data/vendors.json).

To change a number, add an order, mark something paid, or update a KPI:

1. Open `src/data/vendors.json` (edit it right here on GitHub in the browser — no tools).
2. Change the value, commit.
3. Cloudflare Pages sees the commit and redeploys automatically (~30–60s).
4. Refresh `dashboard.sacci.space` — done.

The structure is plain: `kpis`, `projects` (each with `vendors` → `lines` + a
`nextAction`), `pending`, `contacts`.

> Anything typed into `vendors.json` becomes public on the dashboard. Banking/account
> numbers are intentionally left out (RESTRICTED per Hermes classification rules) —
> keep it that way.

---

## Run it locally (optional)

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

Requires Node 18+.

---

## First-time deploy: Cloudflare Pages → dashboard.sacci.space

Do this once. After it's wired up, every push deploys automatically.

### 1. Create the Pages project
1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git** → pick the `sacci-dashboard` repo.
2. Set the build configuration:
   | Setting | Value |
   |---|---|
   | Production branch | `main` |
   | Framework preset | `Vite` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | *(leave blank — the app is at the repo root)* |
3. **Save and Deploy.** You'll get a `*.pages.dev` URL to confirm it works.

### 2. Attach the subdomain
1. In the Pages project → **Custom domains** → **Set up a custom domain** →
   enter `dashboard.sacci.space`.
2. If `sacci.space` is already on Cloudflare DNS, Cloudflare adds the `CNAME`
   automatically. If DNS is elsewhere, add this record at your DNS provider:
   ```
   CNAME   dashboard   <your-project>.pages.dev
   ```
3. HTTPS is issued automatically. Live in a couple of minutes.

---

## File map

```
sacci-dashboard/
├── index.html              # fonts + root mount
├── package.json
├── vite.config.js
├── public/_headers         # Cloudflare security headers (noindex, no framing)
└── src/
    ├── main.jsx
    ├── App.jsx             # all components (data-driven)
    ├── styles.css          # brand token system (light/dark)
    └── data/vendors.json   # ← EDIT THIS to update the dashboard
```
