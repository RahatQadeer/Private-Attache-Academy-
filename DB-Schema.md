# Private Attaché Ecosystem — Database Schema
### For direct DB setup (all schemas created up front, then each dev works within their own tables)

**Stack:** Postgres via one shared Supabase project (no per-module Supabase
projects). Next.js (App Router) on Vercel is the one application consuming
this schema across all four module route groups. Supabase Auth backs the
`users` table and the shared login flow; Supabase Storage backs the
`documents` table's `file_url` and Academy's video/attachment assets, with
signed URLs for anything gated by `visibility` or entitlement. Row-level
security policies, written alongside each table's migration, are the
enforcement mechanism for the Internal/Client Visible/Restricted model and
for workspace isolation — not an afterthought layered on later. Ship the
schema below as versioned Supabase migrations committed to the `base`
branch so every dev runs `supabase db push` against the same project
instead of configuring their own local database.

This document lists every table, its owner, and its fields, organized by
schema. Base is shared and owned by no single module. Each module schema
is prefixed and owned by the person named. Foreign keys always point at
the base tables for identity, contacts, companies, and documents — never
duplicated per module.

Corrections applied per latest direction:
- **Commission rate is the same across Academy, Platform, and Enterprise
  by default** — the source material only gives one concrete figure (15%)
  and frames every other number as an illustrative example, not a mandated
  per-program split. A single default rate is used for all three, with
  partner-specific and admin overrides still fully supported per-partner
  where the business later decides to differentiate.
- **Attribution window is 90 days for everyone by default**, except
  **Enterprise Opportunities, which use 180 days** — this is the one
  distinction the source material actually mandates explicitly (SRS
  Section 17.6.9 / Partner Center Admin Configuration sheet). Nothing else
  varies unless a later document says otherwise.
- **Instructor publishing flow corrected:** an Instructor can create and
  edit course content within programs assigned to them, but cannot publish
  directly. They submit for approval; once an Admin approves, either the
  Instructor or the Admin can publish. Reflected in `academy_publish_requests`
  below.

---

## BASE SCHEMA (shared — no module duplicates these)

### `users`
| Field | Type | Notes |
|---|---|---|
| id | uuid, pk | |
| email | text, unique | |
| password_hash | text, nullable | null if OAuth-only |
| oauth_provider | text, nullable | `google`, etc. |
| oauth_id | text, nullable | |
| full_name | text | |
| preferred_name | text, nullable | |
| salutation | text, nullable | Dr., Mr., Mrs., Ms., Sir, Dame, etc. |
| phone | text, nullable | |
| avatar_url | text, nullable | |
| timezone | text | |
| status | enum | active, suspended, deleted |
| last_login_at | timestamp, nullable | |
| created_at / updated_at | timestamp | |

### `workspaces`
| Field | Type | Notes |
|---|---|---|
| id | uuid, pk | |
| name | text | |
| url_slug | text, unique | |
| logo_url | text, nullable | |
| team_size | text, nullable | |
| timezone | text, nullable | |
| owner_user_id | fk → users.id | |
| created_at / updated_at | timestamp | |

### `workspace_members`
| Field | Type | Notes |
|---|---|---|
| id | uuid, pk | |
| workspace_id | fk → workspaces.id | |
| user_id | fk → users.id | |
| role | enum | owner, admin, team_lead, coordinator, billing, viewer |
| status | enum | active, invited, suspended |
| created_at | timestamp | |

### `entitlements`
| Field | Type | Notes |
|---|---|---|
| id | uuid, pk | |
| user_id | fk → users.id | |
| product | enum | whitbyos, client_portal, academy, partner_center |
| workspace_id | fk → workspaces.id, nullable | null for academy/partner (not workspace-scoped) |
| status | enum | active, trial, expired, revoked |
| is_default_landing | boolean | |
| created_at / updated_at | timestamp | |

### `invitations`
One generic table reused by team invites, client member/authorized-user invites, and partner-application approvals.

| Field | Type | Notes |
|---|---|---|
| id | uuid, pk | |
| token | text, unique | |
| inviter_user_id | fk → users.id | |
| invitee_email | text | |
| invitee_name | text, nullable | |
| context_type | enum | team_member, client_member, client_authorized_user, partner_team |
| context_id | uuid | polymorphic — workspace_id, client_id, or partner_profile_id depending on context_type |
| role_or_relationship | text | |
| status | enum | pending, accepted, expired, revoked |
| sent_at / accepted_at / expires_at | timestamp | |
| created_by | fk → users.id | |

### `contacts`
Canonical person record — reused by WhitbyOS (as Client members, Provider individuals) and Partner Center (as Partner team members).

| Field | Type | Notes |
|---|---|---|
| id | uuid, pk | |
| first_name / last_name | text | |
| preferred_name | text, nullable | |
| salutation | text, nullable | |
| email | text, nullable | |
| phone | text, nullable | |
| title_role | text, nullable | |
| source | text, nullable | how this record was created |
| enrichment_data | jsonb, nullable | website/social/profile links etc. |
| created_by_workspace_id | fk → workspaces.id, nullable | which workspace first created this record, for scoping |
| created_at / updated_at | timestamp | |

### `contact_roles`
Join table capturing every relationship-role label a Contact can carry, per SRS Section 5.5 and 13.14.

| Field | Type | Notes |
|---|---|---|
| id | uuid, pk | |
| contact_id | fk → contacts.id | |
| related_type | enum | client, company, request, workstream, partner_profile |
| related_id | uuid | |
| role_label | enum | primary_member, additional_member, authorized_user, dependent, primary_contact, billing_contact, decision_maker, authorized_representative, provider, partner_company_admin, partner_referral_contact, partner_billing_contact, partner_authorized_signer, partner_read_only |
| workspace_id | fk → workspaces.id, nullable | |
| portal_access | boolean | |
| scope | jsonb, nullable | selected requests/functions this role is limited to |
| created_at | timestamp | |

### `companies`
Canonical organization record — reused by WhitbyOS (Companies, Providers) and Partner Center (Partner Company).

| Field | Type | Notes |
|---|---|---|
| id | uuid, pk | |
| name | text | |
| website | text, nullable | |
| industry_type | text, nullable | |
| addresses | jsonb, nullable | supports multiple locations |
| markets | jsonb, nullable | array of region/country/state/city |
| audience_served | text, nullable | |
| enrichment_data | jsonb, nullable | |
| created_by_workspace_id | fk → workspaces.id, nullable | |
| created_at / updated_at | timestamp | |

### `company_contacts`
| Field | Type | Notes |
|---|---|---|
| id | uuid, pk | |
| company_id | fk → companies.id | |
| contact_id | fk → contacts.id | |
| title_function | text, nullable | |
| is_primary | boolean | |

### `documents`
Shared Documents model — used by WhitbyOS, Client Portal, and Partner Center.

| Field | Type | Notes |
|---|---|---|
| id | uuid, pk | |
| title | text | |
| file_url | text | |
| context_type | enum | client, request, workstream, partner_profile, company, contact |
| context_id | uuid | |
| visibility | enum | internal, client_visible, restricted |
| status | enum | current, action_needed, completed, archived |
| version | integer | |
| effective_date | date, nullable | |
| signed_date | date, nullable | |
| superseded_by_document_id | fk → documents.id, nullable | |
| uploaded_by_user_id | fk → users.id, nullable | |
| shared_by_user_id | fk → users.id, nullable | |
| created_at / updated_at | timestamp | |

### `document_labels`
| Field | Type | Notes |
|---|---|---|
| id | uuid, pk | |
| document_id | fk → documents.id | |
| label_text | text | |
| created_by_user_id | fk → users.id | |

### `audit_log`
| Field | Type | Notes |
|---|---|---|
| id | uuid, pk | |
| actor_user_id | fk → users.id | |
| entity_type | text | |
| entity_id | uuid | |
| action | text | |
| previous_value | jsonb, nullable | |
| new_value | jsonb, nullable | |
| reason | text, nullable | |
| created_at | timestamp | |

### `taxonomy_categories` / `taxonomy_subcategories`
Shared Category/Subcategory reference (SRS Section 10), used by WhitbyOS Providers and Partner Center capability tagging.

| Field | Type | Notes |
|---|---|---|
| id | text, pk | e.g. CAT-0010 |
| slug | text | |
| name | text | |
| sort_order | integer | |
| active | boolean | |
| default_sensitivity | enum | normal, sensitive |

`taxonomy_subcategories` mirrors this with `parent_category_id` fk.

---

## WHITBYOS SCHEMA — owner: Sabahat (prefix `whitbyos_`)

### `whitbyos_clients`
id, workspace_id (fk), name, client_type (individual/family/company/organization), status, owner_user_id (fk users), primary_contact_id (fk contacts), preferences (jsonb), created_at, updated_at

### `whitbyos_client_members`
id, client_id (fk), contact_id (fk contacts), role (mirrors contact_roles enum), portal_access (bool), max_additional_members, max_authorized_users, created_at

### `whitbyos_requests`
id, client_id (fk), workspace_id (fk), title, desired_outcome, definition_of_done, status, priority, owner_user_id (fk), start_date, target_date, waiting_on, next_action, visibility (private_to_requestor/selected_people/client_account), created_at, updated_at, closed_at

### `whitbyos_request_participants`
id, request_id (fk), participant_type (team_member/contact/company/provider), participant_id, role, created_at

### `whitbyos_workplans`
id, request_id (fk, 1:1), name, desired_outcome, definition_of_done, owner_user_id, status (draft/active/paused/complete), start_date, target_date, current_next_action, version, created_at, updated_at

### `whitbyos_workplan_versions`
id, workplan_id (fk), version_number, snapshot (jsonb), change_reason, created_by_user_id, created_at

### `whitbyos_workstreams`
id, workplan_id (fk), name, purpose, priority, owner_user_id, status, target_date, next_action, progress, sort_order, created_at, updated_at

### `whitbyos_workstream_dependencies`
id, workstream_id (fk), depends_on_workstream_id (fk, nullable), depends_on_task_id (fk, nullable), description

### `whitbyos_tasks`
id, workspace_id (fk), request_id (fk, nullable), workstream_id (fk, nullable), title, owner_user_id, status, priority, due_date, waiting_state, dependency_task_id (fk, nullable), next_action, completion_evidence, visibility, created_at, updated_at

### `whitbyos_worksheets`
id, workstream_id (fk), title, type, data (jsonb), created_from (blank/template/duplicate/whitby), created_at, updated_at

### `whitbyos_worksheet_rows`
id, worksheet_id (fk), row_data (jsonb), linked_task_id (fk, nullable), linked_provider_id (fk, nullable), linked_decision_id (fk, nullable), created_at

### `whitbyos_forms`
id, workspace_id (fk), title, is_template (bool), fields (jsonb schema), embed_enabled (bool), created_at, updated_at

### `whitbyos_form_submissions`
id, form_id (fk), request_id (fk, nullable), client_id (fk, nullable), submitted_by_contact_id (fk, nullable), status, responses (jsonb), submitted_at

### `whitbyos_checklists`
id, workstream_id (fk), title, items (jsonb), source_playbook_id (fk, nullable), created_at

### `whitbyos_playbooks`
id, workspace_id (fk), name, category, contents (jsonb), version, shared_level (my/shared/org), created_from_workplan_id (fk, nullable), created_at, updated_at

### `whitbyos_providers`
id, contact_id (fk, nullable), company_id (fk, nullable), readiness (prospect/screened/qualified/preferred/inactive/excluded), category_id (fk taxonomy), subcategory_id (fk taxonomy), specialty_capability (text), evidence_source, last_verified_at, outreach_status, next_follow_up_date, created_at, updated_at

### `whitbyos_provider_options`
id, request_id (fk), provider_id (fk), status (option_for_review/shortlisted/selected/confirmed), client_visible_content (jsonb), created_at

*(Provider documents/agreements use base `documents` with `context_type='company'` or `'contact'`.)*

### `whitbyos_messages` / `whitbyos_message_participants`
- `whitbyos_messages`: id, workspace_id, thread_id, request_id (fk, nullable), client_id (fk, nullable), sender_type (user/contact), sender_id, body, source (native/gmail/outlook), external_message_id, created_at
- `whitbyos_message_participants`: id, thread_id, participant_type (user/contact), participant_id, history_visibility (full/from_added), added_by_user_id, added_at, removed_at, locked (bool — sensitive conversation)

### `whitbyos_communications`
id, workspace_id, request_id (fk, nullable), client_id (fk, nullable), type (call/meeting/text/whatsapp/other), summary, logged_by_user_id, occurred_at

### `whitbyos_calendar_events`
id, workspace_id, external_calendar (google/outlook), external_event_id, title, start_at, end_at, linked_client_id (fk, nullable), linked_request_id (fk, nullable), linked_contact_id (fk, nullable), client_visible (bool), created_at

### `whitbyos_notes`
id, request_id (fk), type (risk/decision_needed/approval/general), body, visibility, created_by_user_id, created_at

### `whitbyos_considerations`
id, workplan_id (fk), workstream_id (fk, nullable), type (missing_info/dependency_conflict/stale_info/risk_backup_gap/calendar_conflict/requirement_prompt/next_action), body, source_reference, status (open/dismissed/resolved), converted_to_task_id (fk, nullable), created_at, resolved_at

### `whitbyos_decisions`
id, request_id (fk), workstream_id (fk, nullable), title, options (jsonb), recommendation, decision_maker_contact_id (fk, nullable), approver_contact_id (fk, nullable), due_date, amount_threshold, status, result, created_at

### `whitbyos_risks`
id, workstream_id (fk), risk, impact, mitigation, backup_plan, trigger, status, created_at

### `whitbyos_updates`
id, request_id (fk, nullable — null for Plans & Updates), client_id (fk), type (progress_update/plans_update), body, status (draft/review/published), published_at, created_by_user_id, created_at

### `whitbyos_timeline_events`
id, request_id (fk), event_type, description, source_reference, client_visible (bool), created_at

### `whitbyos_knowledge`
id, workspace_id, title, type (guide/sop/policy), body_or_file_url, category, status (draft/review/published), created_at, updated_at

### `whitbyos_integrations`
id, workspace_id, provider (gmail/outlook_mail/google_calendar/outlook_calendar/stripe/quickbooks), status (connected/needs_attention/disconnected), connected_account, scopes, last_sync_at, error_state, created_at

*(Insights and Reports nav are computed views over `whitbyos_considerations` and other tables above — no dedicated table needed beyond an optional `whitbyos_insight_saves` for the "Saved" filter: id, consideration_id, saved_by_user_id, created_at.)*

---

## CLIENT PORTAL SCHEMA — owner: Rohail (prefix `client_portal_`)

Deliberately small — the portal reads/writes `whitbyos_*` tables directly through the permission layer for everything else (Requests, Documents, Forms, Messages, Updates, Calendar).

### `client_portal_access_requests`
id, client_id (fk whitbyos_clients), requested_by_contact_id (fk contacts), person_name, person_email, relationship, requested_role, reason, status (pending/approved_as_requested/approved_edited/declined), reviewed_by_user_id (fk, nullable), reviewed_at, created_at

### `client_portal_notification_prefs`
id, contact_id (fk), event_type (new_message/progress_update/action_needed/form_requested/document_shared/approval_requested/calendar_change/request_status_change/invoice_payment_event), channel, enabled (bool)

---

## ACADEMY + LMS SCHEMA — owner: Rahat (prefix `academy_`, one schema for both surfaces)

### `academy_programs`
id, name, type (cpa/professional_practice_accelerator/specialty_endorsement/intelligent_coordination/free_course/paid_course), category, prerequisite_program_id (fk self, nullable), price (nullable — free if null), status (draft/pending_approval/published), description, created_by_user_id (fk), created_at, updated_at

### `academy_modules`
id, program_id (fk), title, sort_order

### `academy_lessons`
id, module_id (fk), title, type (video/reading/attachment/quiz), content_url, sort_order

### `academy_quizzes`
id, lesson_id (fk), passing_score

### `academy_questions`
id, quiz_id (fk), question_text, type (multiple_choice/true_false), options (jsonb), correct_answer, sort_order

### `academy_enrollments`
id, user_id (fk base users), program_id (fk), status (enrolled/in_progress/completed), progress_percent, entitlement_source (purchase/free/admin_assigned/prerequisite_met), enrolled_at, completed_at

### `academy_lesson_progress`
id, enrollment_id (fk), lesson_id (fk), status (locked/in_progress/completed), completed_at

### `academy_credentials`
id, user_id (fk), program_id (fk), type (cpa_credential/specialty_endorsement/certificate_of_completion), status (required_learning/applied_work/final_assessment/credential_review/awarded), awarded_at, expires_at (3 years from award for CPA), renewal_status

### `academy_instructor_assignments`
id, user_id (fk — must carry Instructor role), program_id (fk), permission_level (edit/create — never publish), assigned_by_admin_user_id (fk), created_at

### `academy_publish_requests`
Reflects the corrected workflow: Instructor can create/edit but not publish directly.

id, program_id (fk), submitted_by_user_id (fk — the Instructor), status (pending/approved/rejected), reviewed_by_admin_user_id (fk, nullable), reviewed_at, notes, published_by_user_id (fk, nullable — either the Instructor after approval, or the Admin directly), published_at, created_at

### `academy_training_workspaces`
id, user_id (fk), workspace_id (fk base workspaces — the restricted WhitbyOS workspace created for this learner), program_id (fk — the CPA program), provisioned_at, expires_at (90 days from provisioning), status (active/expired), converted_to_paid_at (timestamp, nullable)

---

## PARTNER CENTER SCHEMA — owner: Zara (prefix `partner_`)

### `partner_profiles`
id, company_id (fk base companies), primary_contact_id (fk base contacts), status (applied/under_review/approved/active/declined), partner_type, application_data (jsonb), agreement_status, agreement_document_id (fk base documents, nullable), tax_profile_status, payment_setup_status, payout_eligibility (eligible/needs_tax_setup/needs_payment_setup/on_hold), created_at, updated_at

### `partner_team_members`
id, partner_profile_id (fk), contact_id (fk base contacts), function (company_admin/referral_contact/billing_payment_contact/authorized_signer/read_only), access_level, created_at

### `partner_programs`
id, partner_profile_id (fk), program (academy/platform/enterprise), active (bool), effective_start, effective_end

### `partner_commission_rules`
id, partner_profile_id (fk, nullable — null means this is the global default rule), program (academy/platform/enterprise), rate_type (percentage/flat), rate_value (**default 15% across all three programs unless a specific partner override exists**), earning_basis, eligible_period, attribution_window_days (**default 90 for Academy and Platform; 180 for Enterprise**), eligible_revenue_rules (jsonb), payment_terms, effective_start, effective_end, created_at

### `partner_links_codes`
id, partner_profile_id (fk), code (unique), type (referral_link/access_code/campaign_event), cookie_life_days, created_at

### `partner_referrals`
id, partner_profile_id (fk), referral_code_id (fk), referred_user_id (fk base users, nullable until account created), referred_contact_id (fk base contacts, nullable), program (academy/platform), product, source (link/code/manual/campaign/admin), referral_date, status (referred/in_progress/converted/not_converted), conversion_event_date (nullable), created_at

### `partner_opportunities`
id, partner_profile_id (fk), company_id (fk base companies), primary_contact_id (fk base contacts), product_interest (academy_seats/platform_users/combined/other), estimated_seats, estimated_value (nullable), status (submitted/accepted/in_progress/converted/not_moving_forward), accepted_at (nullable), protected_until (accepted_at + 180 days), notes, permission_to_contact (bool), attachment_document_id (fk base documents, nullable), created_at

### `partner_attribution_events`
id, partner_profile_id (fk), referral_id (fk, nullable), opportunity_id (fk, nullable), referred_user_id (fk base users), product, qualifying_action, event_source (stripe/quickbooks), external_payment_id, event_timestamp, created_at

### `partner_earnings`
id, attribution_event_id (fk), partner_profile_id (fk), commission_rule_id (fk), amount, status (pending/approved/payable/paid/held/reversed/ineligible), collected_payment_source (stripe/quickbooks), collected_payment_ref, payable_date (nullable), paid_date (nullable), created_at, updated_at

### `partner_earning_adjustments`
id, earning_id (fk), type (refund/chargeback/manual), amount_delta, reason, created_by_admin_user_id (fk), created_at

### `partner_payouts`
id, partner_profile_id (fk), amount, method (stripe_connect/quickbooks/ach/check), status (scheduled/paid/failed), reference, paid_at (nullable), created_at

### `partner_tax_profiles`
id, partner_profile_id (fk), legal_payee_name, business_dba_name, entity_classification, mailing_address, country, tin_last4 (masked), form_type (w9/w8/other), status (not_started/in_progress/complete/needs_attention/review_required/expired), collection_source (stripe_tax/quickbooks_w9/other), external_record_id, certified_at, last_reviewed_at

*(Partner documents use the base `documents` table with `context_type='partner_profile'`; agreements, terms, tax certs all flow through it with the standard labeling system — no separate `partner_documents` table.)*

---

## Cross-Module Foreign Key Cheat Sheet

- Every table that references a person → base `users.id` or base `contacts.id`. Never a locally duplicated identity column.
- `partner_attribution_events.referred_user_id` → `users.id`
- `partner_profiles.company_id` / `.primary_contact_id` → `companies.id` / `contacts.id`
- `whitbyos_providers.contact_id` / `.company_id` → `contacts.id` / `companies.id`
- `whitbyos_client_members.contact_id` → `contacts.id`
- `academy_training_workspaces.workspace_id` → `workspaces.id` (created by Sabahat's schema, referenced by Rahat's)
- `documents.context_id` → varies by `context_type` (polymorphic; no formal FK constraint possible here, enforce in application layer)

## Setup Recommendation

Building all schemas up front, before each dev starts, is the right call for this project specifically — it's what prevents the exact duplication problem (separate identity tables, separate document tables per module) that would otherwise surface only after four people have already built on top of their own divergent assumptions. Two suggestions on top of what's here:

1. Put this schema in a migration tool (Prisma, Drizzle, or plain SQL migrations) committed to the `base` branch, rather than manually clicking through a DB GUI — so every dev pulls the same schema via `git pull` + `migrate` instead of you re-creating it by hand if it ever needs a tweak.
2. Give each dev write access scoped to their own prefixed tables where your DB supports it (Postgres row-level grants, or just a team norm enforced in code review) — nobody should need to alter `users` or `documents` to ship a feature in their own module; if they think they do, that's the signal to come back to this schema first.
