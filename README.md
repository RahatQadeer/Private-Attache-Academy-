# Private Attaché System

One Next.js app, one Vercel project, one Supabase project. Four products behind a shared identity and a product switcher.

**Private Attaché** is the master brand and app shell. **Whitby** is the intelligent coordination layer inside it. Do not label any screen "Whitby OS".

## Stack

- Next.js App Router on Vercel
- Supabase Auth, Postgres, Storage
- Shared design system and canonical tables in `/base`

## Git workflow

```bash
git clone https://github.com/righttailorg-2/Private-Attache-System.git
cd Private-Attache-System
git checkout base
git checkout -b <name>/<module>
```

Examples:

- `sabahat/whitbyos`
- `rohail/client-portal`
- `rahat/academy-lms`
- `zara/partner-center`

Work only inside your assigned module folder. Do not modify another person's folder or `/base` without coordinating. Open a PR against `base`, not `main`. `main` stays untouched until base is verified.

Set the Vercel production branch to **`base`** until this phase is verified. Preview deployments still spin up from every PR.

## Who owns what

| Person | Folder | Tables |
|---|---|---|
| Laiba | `/base`, shared auth, switcher, design system | `users`, `workspaces`, `workspace_members`, `entitlements`, `invitations`, `contacts`, `contact_roles`, `companies`, `company_contacts`, `documents`, `document_labels`, `audit_log`, `taxonomy_*` |
| Sabahat | `/modules/whitbyos` and `app/modules/whitbyos` | `whitbyos_*` |
| Rohail | `/modules/client-portal` and `app/modules/client-portal` | `client_portal_access_requests`, `client_portal_notification_prefs` only. Everything else is `whitbyos_*` through the permission layer. Never create `client_portal_requests` or `client_portal_documents`. |
| Rahat | `/modules/academy` and `app/modules/academy` | `academy_*` (Academy + LMS, one schema) |
| Zara | `/modules/partner-center` and `app/modules/partner-center` | `partner_*` |

Each module folder already has a `cursor.md`. Open Cursor there and start.

## Team dependency map

- **Sabahat ↔ Rohail (daily):** the Client Portal is a permission-scoped layer on Sabahat's `whitbyos_*` tables. Schema changes to Requests, Forms, Documents, or Messages need to be communicated before they ship.
- **Sabahat ↔ Zara (schema):** Partner profiles sit on base `contacts` / `companies`. Confirm those fields before Zara builds on top.
- **Zara ↔ Sabahat + Rahat (events):** Partner attribution needs a product-qualifying action from Whitby (Stripe subscription activation) and from Academy (course enrollment). Agree the payload shape early.
- **Rahat ↔ Sabahat (one hand-off):** Academy Training Workspace provisions a restricted Whitby workspace with a 90-day expiry.
- **Everyone ↔ Laiba:** new shared fields on `users`, `contacts`, `companies`, or `documents` are requested from base. Do not add a local duplicate column.

## Local setup

1. Copy `.env.example` to `.env.local` and fill in the one shared Supabase project (URL, anon key, service role). Set the same three values once on the Vercel project — never per module.
2. Enable Email and Google providers in Supabase Auth. Add `http://localhost:3000/auth/callback` and the Vercel URL as redirect URLs.
3. Push schema:

```bash
npx supabase db push
```

4. Install and run:

```bash
npm install
npm run dev
```

5. Sign up → create a workspace → land on the switcher → open a placeholder module.

## Routes

| Path | Purpose |
|---|---|
| `/` | Marketing landing |
| `/signup` `/login` `/forgot-password` `/reset-password` | Shared auth |
| `/invite/[token]` | Generic invitation accept |
| `/onboarding/*` | Professional workspace onboarding |
| `/switcher` | Four-product switcher |
| `/modules/whitbyos` | Whitby placeholder |
| `/modules/client-portal` | Client Portal placeholder |
| `/modules/academy` | Academy placeholder |
| `/modules/partner-center` | Partner Center placeholder |

## Switcher rules

- More than one active entitlement → show the switcher.
- Exactly one → route directly there.
- Zero-entitlement products: `NEXT_PUBLIC_SWITCHER_UNENTITLED=grey` (default, muted card + apply/explore) or `hide`. Do not hard-code this.

## Source documents

- `Private-Attache-Ecosystem-SRS-v3.md`
- `design-system.md`
- `DB-Schema.md`
- `base/cursor.md`

## Open items (flagged, not silently resolved)

1. Zero-entitlement switcher behavior (mechanism supports both).
2. Default landing rules per role (`entitlements.is_default_landing` exists; business rules TBD).
3. Exact role vocabulary per module (Whitby starting list is Owner, Admin, Team Lead, Coordinator, Billing, Viewer).
4. Academy and LMS live in one folder (`/modules/academy`) as recommended.
