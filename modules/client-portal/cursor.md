# Cursor context — Client Portal

Owner: Rohail  
Branch off `base`: `rohail/client-portal`  
Routes: `app/modules/client-portal`  
Tables: `client_portal_access_requests`, `client_portal_notification_prefs` only

## Brand

Branded as "[Company Name] Client Portal", never as Whitby. Example: "Acme Client Portal".

## Data model (non-negotiable)

The portal is a permission-scoped read/write layer on Sabahat's `whitbyos_*` tables plus base `documents`. Do not create `client_portal_requests`, `client_portal_documents`, or any forked identity/contact table.

Coordinate daily with Sabahat. Any schema change they make to Requests, Forms, Documents, or Messages hits you the same day.

## Nav

Home, Requests, Calendar, Messages, Updates, Forms, Documents, Billing, Integrations.

Tasks is not a main nav item — client tasks/approvals surface in Home → Action Needed. Profile & Settings lives under the avatar: Profile, Preferences, Notifications, People & Access, Security, Privacy.

Home sub-nav: Overview, Action Needed, Recent Activity.

## Access

The professional sets the account ceiling. Request access is Private to Requestor / Selected People / Client Account. Conversation access can be narrower. Restricted overrides broader access.

Clients cannot grant portal access. They submit a People & Access request (`client_portal_access_requests`). The professional approves, edits, or declines. Only then does Whitby send an invitation through the shared `invitations` table.

## Never show the client

Internal Workplans, Notes, provider research/scoring, risks, internal AI output, professional-only Tasks, internal discussion, a global Timeline.

## Design

Same left nav pattern as the professional app. Import from `/base/components`. Module icon uses the portal tan token. Read `design-system.md` before any new screen.
