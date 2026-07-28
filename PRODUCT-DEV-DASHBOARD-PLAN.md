# Product Development Dashboard — Consolidation Plan

## Purpose

Evolve `dashboard.sacci.space` from a static vendor-order snapshot into House of
Sacci's product-development command surface. It should make every active product
program legible: what is being built, its stage, owner, vendor dependencies,
required approvals, source documents, costs, and blockers.

This is a consolidation effort. Do not create a parallel product tracker when an
existing robust Sacci codebase or the `hos-happy-stick` operations model already
covers a domain.

## Current baseline

- Repository: `therealjohndough/sacci-dashboard`
- Deployment: Cloudflare Pages at `dashboard.sacci.space`
- Stack: Vite + React
- Current data model: `src/data/vendors.json`, bundled at build time
- Current functionality: project/vendor display, search, status filtering,
  attention filtering, collapsible project cards, and theme selection
- Current limitation: a July 21, 2026 snapshot; no authenticated backend or live
  source synchronization
- Adjacent operational implementation: `hos-happy-stick` contains the initial
  Supabase `ops_projects` and `project_documents` workflows. Treat it as source
  evidence, not an automatic replacement for this dashboard.

## Working product-development model

### Primary record: product program

Every program must have one stable project code and one project detail page.
Examples: Rosin Vape Pen .5g O2 Run 02, Sacci Silencer 2g Vape, 1g Quartz Vape,
flower packaging system.

Required fields:

- Project code, title, product family, format, and cultivar/SKU scope
- Lifecycle stage: Intake, Briefed, Development, Samples/Proofs, In Review,
  Approved, In Production, Received, Launched, Paused, or Closed
- Owner, approver, requested-by, priority, due date, and status
- Current decision/blocker, next action, and accountable person
- Source/provenance fields: source system, source reference, source URL, source date

### Supporting records

- **Milestones:** brief, quote, sample/proof, compliance review, PO/deposit,
  production, shipment, receipt, launch
- **Vendor relationships:** vendor, contact, quote/invoice reference, lead time,
  payment/shipping status; never place banking details in the frontend
- **Documents:** artwork, dielines, invoices, COAs, vendor correspondence, proofs,
  photos, and approvals—each with source provenance
- **Costs:** unit cost, quantity, freight, landed cost, deposit, balance, currency,
  and estimate-vs-final state
- **Decisions and approvals:** decision, options, owner, due date, final outcome,
  and the evidence that supports it

## Target user experience

1. **Pipeline home** — stage-based overview, priority/blocker queue, and product
   programs needing an approval or next action.
2. **Program detail** — one durable page for a product program, with its timeline,
   vendors, economics, documents, open decisions, and activity.
3. **Approval queue** — a short, owner-facing list of decisions that are overdue or
   require explicit sign-off; no silent inferred approvals.
4. **Vendor/cost view** — drill-down for product-development dependencies without
   becoming the primary information architecture.
5. **Search and filters** — lifecycle stage, owner, product family, vendor, status,
   priority, and text search.

The visual direction is white/bone-first for web operations, with restrained Sacci
green for structure and state. Follow the local design source at
`sacci-branding/house-of-sacci-design-system` when it is available. The design system
is evolving; do not treat unsettled logo or token choices as immutable.

## Data and access architecture

### Phase 1 — preserve the current static dashboard

- Keep `vendors.json` as an explicitly dated seed/snapshot.
- Do not claim it is live data.
- Keep Cloudflare Access in front of any internal vendor, project, or cost data.
- Continue excluding banking/account details from client-side bundles.

### Phase 2 — reconcile the robust codebase

When the work-computer agent's repository becomes accessible:

1. Inventory its routes, components, data model, migrations, auth model, and deploy
   configuration.
2. Compare it against this repository and `hos-happy-stick`.
3. Select one canonical implementation repository before moving code or data.
4. Preserve stable URLs and avoid copying the same dashboard into multiple repos.
5. Record the disposition of each duplicate or superseded surface.

### Phase 3 — live operations data

- Use the established Sacci Supabase project and the existing `ops_projects` /
  `project_documents` direction only after remote migration state is verified with
  an authorized project owner.
- Extend the data model for milestones, decisions, vendor costs, and provenance;
  avoid a second unconnected database.
- Enforce role-aware access before exposing the dashboard to anyone beyond the
  internal operations team.
- Keep project documents private and server-mediated unless an approved storage/RLS
  policy explicitly changes that model.

## Migration sequence

1. Obtain and audit the robust codebase from the work computer.
2. Choose the canonical repository and deployment surface.
3. Define the shared product-program schema and field authority matrix.
4. Map existing vendor snapshot records into product programs, milestones, and costs.
5. Build the pipeline home and a single program-detail route using seed data first.
6. Add the approval queue and source/provenance display.
7. Connect verified Supabase reads; verify RLS and Cloudflare Access.
8. Add authenticated write workflows only after owner/approver roles are decided.
9. Migrate historical documents with external-source links/checksums where applicable.
10. Retire the static vendor-only view only after the new surface covers its use cases.

## Owner decisions required

- Which repository from the work computer is the intended long-term canonical base?
- Is `dashboard.sacci.space` the durable product-development URL, or should it fold
  into the existing Sacci portal?
- Who can view, edit, approve, and administer product-development records?
- Is Google Drive the historical document archive with Supabase as a portal copy, or
  is Supabase replacing it?
- Which sources govern product identity, availability, marketing copy, batch facts,
  and production costs?
- Which design-system choices are settled enough to encode as shared components?

## Completion criteria

- One canonical codebase and deploy target are named.
- Each active product program has a durable record, provenance, owner, next action,
  and approval state.
- Vendor, cost, and document data are connected to product programs rather than
  existing as disconnected snapshots.
- Internal access is enforced at the edge and in the data layer.
- The old static view is either retained as a clearly dated historical snapshot or
  replaced without loss of operational coverage.
