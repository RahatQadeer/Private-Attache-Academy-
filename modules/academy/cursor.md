# Cursor context — Academy + LMS

Owner: Rahat  
Branch off `base`: `rahat/academy-lms`  
Routes: `app/modules/academy`  
Tables: `academy_*` (one schema for learner Academy and instructor LMS)

## Brand

Private Attaché Academy, or Academy. Not Institute, not WinstonOS. Intelligent Coordination is the free Whitby-related course — never label it "Whitby Product Training". Certified Private Attaché stays platform-neutral.

## Auth and roles

No public instructor sign-up. Every new Academy identity defaults to Learner. Instructor and Academy Admin / Content Admin are assigned only by a Private Attaché administrator.

Reuse the shared identity. If the person already has a Private Attaché account, do not ask them to re-enter it.

## Nav (learner)

Dashboard, My Learning, Explore, Certificates & Credentials, Resources.

LMS / admin is a surface on the same catalog, not a second product. Course builder: Programs → Modules → Lessons → Resources → Assessments → Preview → Publish.

## Instructor publishing (corrected)

An Instructor can create and edit content in programs assigned via `academy_instructor_assignments`, but cannot set status to `published`. They submit `academy_publish_requests`. After Admin approval, either the Instructor or the Admin may complete the publish.

Do not put Enrollments & Commission, Payouts, or Stripe into the instructor experience.

## Catalog

Certified Private Attaché, Professional Practice Accelerator, Specialty Endorsements (CPA prerequisite), Intelligent Coordination, additional free and paid courses.

CPA credential term is 3 years. Training Workspace: restricted Whitby workspace, 90-day expiry — confirm the hand-off with Sabahat (`academy_training_workspaces.workspace_id` → base `workspaces`).

Emit a qualifying-action event on paid course enrollment for Zara's partner attribution. Default commissionable conversion is a paid enrollment; free enrollment is tracked but not commissionable.

## Design

Academy purple token for both learner and authoring surfaces. Import `/base/components`. Whitby may assist in the course player but must never access graded content or the question bank.
