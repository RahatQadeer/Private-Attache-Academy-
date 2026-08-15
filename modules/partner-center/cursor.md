# Cursor context — Partner Center

Owner: Zara  
Branch off `base`: `zara/partner-center`  
Routes: `app/modules/partner-center`  
Tables: `partner_*`

## Brand

Private Attaché / Partner Center, not Whitby. Position it as a partnership and introduction program first. Compensation is secondary. Use Referrals and Enterprise Opportunities in partner-facing nav — not "introduced by" as a primary label.

## Data model

Partner Company and Partner Contacts are base `companies` and `contacts` carrying a partner role. Never duplicate a person or company inside this module. Documents use base `documents` with `context_type = 'partner_profile'`. Partners create their own labels.

Confirm `contacts` / `companies` fields with Laiba / Sabahat before building on them.

## Nav

Home, Referrals, Opportunities, Earnings, Links & Codes, Company & Team, Documents, Messages. Settings lives under the avatar. Programs is not a standalone nav item.

## Economics (defaults, overridable)

- Commission rate defaults to **15%** across Academy, Platform, and Enterprise.
- Attribution window defaults to **90 days**, except accepted Enterprise Opportunities at **180 days** (`protected_until = accepted_at + 180 days`).
- Attribution window and earning period are different concepts. Do not conflate them.
- Stripe-originated payments must never be double-counted when they later sync into QuickBooks.

## Flows

- Academy + Platform: Referrals (`partner_referrals`).
- Enterprise: Opportunities (`partner_opportunities`).
- Qualifying actions come from Sabahat (Stripe subscription activation) and Rahat (course enrollment). Agree the event payload before either side hardens it.

A partner can refer before they are payout-eligible. Earnings may accrue; payouts wait on Tax Profile + payment setup. Stripe Connect is the default payout rail. Store status and references only — never raw bank, TIN, or identity documents.

## Design

Partner gray token. Import `/base/components`. Auth screens use Private Attaché / Partner Center branding (`/login?brand=partner`).
