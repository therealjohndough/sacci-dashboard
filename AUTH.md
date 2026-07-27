# Locking down the dashboard

The dashboard is a **static site** — all data ships inside the public JavaScript
bundle. So any login built *inside* the React app is cosmetic: the data can still be
pulled straight from the `.js` file. The only real lock is one that blocks the request
at Cloudflare's edge, **before any file is served**. That's Cloudflare Access.

We're rolling this out in two phases. **Phase 1 (now)** gates access to House of Sacci
accounts. **Phase 2 (later)** adds true two-factor. Phase 1 is designed so Phase 2
drops in on top with zero rework.

---

## Phase 1 — Require a House of Sacci address (do this now)

One strong factor: only people signed in with a real `@houseofsacci.com` Google
account get in. A big step up from a public URL.

### Prerequisite: everyone who needs the dashboard is on the domain
Gating by `@houseofsacci.com` only works if the people who need access actually have
`@houseofsacci.com` Google accounts. Anyone currently on a personal Gmail needs a
Workspace account first.

- Google Admin console (admin.google.com) → **Directory → Users → Add new user**.
- Make a quick list of who needs the dashboard and confirm each has a domain account.

### Set up the Access gate
1. Cloudflare → **Zero Trust → Access → Applications → Add an application** →
   **Self-hosted**.
2. Application domain: `dashboard.sacci.space`.
3. **Identity provider: Google.** (Zero Trust → Settings → Authentication → add Google
   as a login method if it isn't there yet.)
4. Add a **policy**:
   | Field | Value |
   |---|---|
   | Policy name | `House of Sacci staff` |
   | Action | **Allow** |
   | Include | **Emails ending in** → `@houseofsacci.com` |
   *(To be stricter, use **Emails** and list the exact people instead of the whole domain.)*
5. Save. Now visiting `dashboard.sacci.space` bounces to a Google login; only
   `@houseofsacci.com` accounts pass.

Free on Cloudflare Zero Trust up to 50 users.

---

## Phase 2 — Add real two-factor (later)

Because Access logs users in **through Google**, the moment Google Workspace enforces
2-Step Verification org-wide, this dashboard is 2FA-protected automatically — nothing
to change here.

Rollout (needs a Google Workspace **Super Admin**):
1. **Enroll first, enforce second** — never flip enforcement before people have set up
   their second factor, or the whole org locks out.
2. Admin console → **Security → Authentication → 2-Step Verification** → let users
   enroll → give a deadline → watch the enrollment report.
3. Then set **Enforcement: ON** with a new-user grace period. Pilot on one OU first.
4. Prefer **Google prompt / passkeys** (and **security keys** for anyone touching
   money) over SMS codes.
5. Guardrails: everyone saves **backup codes**; keep a **second Super Admin** with its
   own 2FA; migrate any password-only logins (old mail clients, scanners, scripts) to
   OAuth or app passwords before enforcing.

Effort: ~30 min of clicks; ~1 week of calendar time, all of it getting humans to
enroll.

---

## Later still — when data moves to a backend
When the vendor data moves out of `vendors.json` into Supabase (`ops_projects`), you'd
add real per-user auth + row-level security there. At that point Access can stay as a
perimeter or be replaced by the app's own login. Not needed while the site is static.
