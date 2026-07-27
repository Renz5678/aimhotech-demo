# AImhotech Web Admin Platform — Technical & UI/UX Specification

**Product:** AImhotech Web Admin Platform (aimhotech.io)
**Product Line:** AImhotech — a standalone venture of Hardy & Co. PH Ltd.
**Submitting Organization:** Hardy & Co. PH Ltd.
**Prepared by:** Daniel Scaparro, Founder & CEO
**Document Version:** 1.0 — July 2026
**Audience:** RHU (Rural Health Unit), DOH (Department of Health), and administrative console for Barangay Health Workers, Physicians, and System Administrators

---

## Objectives

The AImhotech Web Admin Platform is the RHU, DOH, and administrative interface for the AImhotech system. Its core objectives:

- Give Rural Health Unit staff, physicians, DOH regional officers, and Hardy & Co. PH Ltd. system administrators a **shared, role-scoped view into the same data** captured by the Mobile App — without duplicating any patient-facing functionality.
- Serve as the primary interface for the **AI Brain's population-level intelligence**: risk queues, referral tracking, clinical validation, device fleet oversight, and reporting.
- Unlike the Mobile App (which supports offline field use), the Web Admin Platform **assumes a stable internet connection** (used from RHU offices, DOH regional offices, or Hardy & Co.'s own operations team) and is optimized for **data density, multi-patient workflows, and reporting** rather than offline field use.

---

## Part A — Technical Specification

### A1. Overview

See Objectives above. Key distinction from Mobile App: online-only, admin/reporting-first, no patient-facing functionality duplicated.

### A2. User Roles and Permissions

| Role | Scope | Key Capabilities |
|---|---|---|
| Barangay Health Worker (Admin View) | Own station only | View own station's patient list, screening history, and sync status; cannot access other stations' data |
| RHU Physician | Assigned RHU and its barangay stations | Review AI-flagged risk queue, clinical validation of hospital-submitted records (license + QR verification), manage referrals |
| DOH Regional Officer | Full region (multi-RHU) | Population-level dashboards, cross-RHU reporting, no default access to individually identifiable records |
| Hardy & Co. PH Ltd. Super Admin | Full platform | User and role management, device/kiosk fleet management, system configuration, audit log access |

> Role scoping directly implements the per-user access control principle defined in Section 4.4 of the business plan: each role sees only the level of detail it requires.

### A3. System Architecture

The Web Admin Platform is a client of the **same backend API and AI Brain** used by the Mobile App, ensuring a single source of truth across both surfaces. The web client holds **no independent business logic** beyond presentation and role-based UI gating — all authorization is enforced server-side.

| Layer | Responsibility | Connects To |
|---|---|---|
| Web Client (Next.js) | Renders role-scoped dashboards, tables, and forms; no offline requirement | API Gateway |
| API Gateway | Authentication, rate limiting, request routing | Backend Services |
| Backend Services (shared with Mobile App) | AI Brain, patient registry, referral engine, reporting engine | Cloud Database, Far EasTone Health⁺ |
| Cloud Database (PostgreSQL) | System of record for all patients, screenings, referrals, users, audit logs | Backend Services, Analytics/Reporting |
| Audit & Compliance Layer | Immutable logging of all access and data changes | Cloud Database |

### A4. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend framework | **Next.js (React) with TypeScript** | Server-side rendering for fast dashboard loads, strong typing for a data-heavy admin surface |
| UI component library | **Tailwind CSS + shadcn/ui** | Rapid, consistent, accessible component development aligned to the Healing Green & Sage design system |
| Charting / data visualization | **Recharts** | Population risk trends, screening volume charts, referral funnel visualization |
| Backend framework | **Node.js (NestJS)** or **Python (FastAPI)** | Shared backend serving both web and mobile clients from one API surface (final choice TBD — see Open Questions) |
| Database | **PostgreSQL (Supabase-hosted)** | Consistent with tooling already used across Hardy & Co. PH Ltd.'s portfolio; relational integrity for clinical data |
| Caching layer | **Redis** | Dashboard query performance at scale (300+ stations by Year 3) |
| Authentication | **Role-based auth with JWT + refresh tokens** | Supports future DOH single sign-on integration without a rebuild |
| Hosting / infrastructure | **Cloud (AWS or GCP) with autoscaling** | Elastic capacity as station count and concurrent admin users grow |
| CI/CD | **GitHub Actions** | Automated testing and deployment pipeline |
| Monitoring | **Sentry** + cloud-native observability (e.g., CloudWatch/Cloud Monitoring) | Uptime and performance tracking against the SLA in Section A9 |

### A5. Core Modules

1. **Population Health Dashboard** — Risk heatmap by barangay, screening volume trends, elevated-risk percentage, referral completion rate. Primary landing view for RHU and DOH roles.
2. **Patient Registry & Search** — Role-scoped patient lookup and detail view, cross-provider screening history.
3. **Risk Queue / Triage Worklist** — AI-flagged cases sorted by priority; primary daily workflow tool for RHU physicians.
4. **Referral Management** — Status tracking (flagged → referred → seen → resolved), with SLA-style aging indicators on stalled referrals.
5. **Clinical Validation Workflow** — Interface for hospital-submitted records; requires submitting clinician's license number and QR-based verification (per Section 4.3 of the business plan) before a record is treated as diagnostic-grade rather than screening-grade.
6. **Device & Kiosk Fleet Management** — Station status, device pairing history, maintenance and firmware alerts, for Hardy & Co.'s operations team.
7. **Reporting & Analytics** — Exportable reports for DOH and LGU stakeholders, including cost-per-screening and impact metrics (per Section 10 of the business plan).
8. **User & Role Management** — Super Admin tooling to provision, deactivate, and reassign accounts across roles and facilities.
9. **Audit Log & Compliance Center** — Searchable, immutable record of data access and changes, supporting Data Privacy Act (RA 10173) compliance reviews.

### A6. Data Model

The Web Admin Platform reads and writes the same core entities defined in the Mobile App Technical Specification: **Patient, Screening Record, Risk Flag, Referral, Consent Record.** It additionally owns the following admin-specific entities:

| Entity | Key Fields | Notes |
|---|---|---|
| Facility | Facility ID, type (barangay station / RHU / hospital), address, assigned LGU | Anchors the barangay area-code identification scheme |
| User Account | User ID, role, assigned facility/region, credentials, status | Drives all role-based access control |
| Clinical Validation Record | Screening/record ID, validating clinician license number, QR verification result, timestamp | Distinguishes diagnostic-grade from screening-grade data per Section 4.3 |
| Device | Device ID, type (Microlife / Bionime / kiosk terminal), assigned facility, status, last maintenance | Feeds the Device & Kiosk Fleet Management module |
| Report | Report ID, type, generated-by, date range, export format | Supports reproducible, auditable reporting for DOH/LGU stakeholders |
| Audit Log Entry | Actor, action, entity affected, timestamp, IP/context | Immutable; write-only from the application's perspective |

### A7. API Specification

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/v1/dashboard/population` | GET | Aggregated population health metrics scoped to the caller's role/facility |
| `/api/v1/patients` | GET | Role-scoped patient search and list |
| `/api/v1/risk-queue` | GET | AI-flagged cases sorted by priority for the caller's scope |
| `/api/v1/referrals/{id}` | GET / PUT | Retrieve or update a referral's status |
| `/api/v1/clinical-validation` | POST | Submit a hospital-validated record with clinician license and QR verification |
| `/api/v1/devices` | GET / PUT | Device fleet status and management |
| `/api/v1/reports` | POST / GET | Generate and retrieve exportable reports |
| `/api/v1/users` | GET / POST / PUT | Super Admin user and role management |
| `/api/v1/audit-log` | GET | Searchable audit trail, Super Admin only |

### A8. Security and Compliance

- **Role-based access control (RBAC):** Enforced server-side on every endpoint; the web client never receives data outside the caller's authorized scope, not merely hides it in the UI.
- **Encryption:** TLS 1.3 in transit; encryption at rest on the database layer.
- **Session management:** Short-lived access tokens with refresh tokens; automatic session timeout on inactivity for shared-workstation environments common in RHU offices.
- **Audit logging:** Every read and write to identifiable patient data is logged with actor, timestamp, and context (per Section A6).
- **Regulatory alignment:** Designed for consistency with the **Philippine Data Privacy Act (RA 10173)**, including data minimization by role and a documented basis for every category of data access.

### A9. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Scalability | Support 300+ barangay stations and their associated user accounts by end of Year 3, per the business plan's deployment schedule |
| Uptime SLA | ≥ 99.5% during business hours (6am–8pm PHT) |
| Dashboard load time | Under 2 seconds for the Population Health Dashboard at current scale |
| Concurrent admin users | Minimum 200 concurrent sessions without degraded performance at Year 3 scale |
| Report generation | Under 60 seconds for standard monthly/quarterly reports |
| Browser support | Latest two versions of Chrome, Edge, Safari; responsive down to tablet width (768px) for RHU staff using tablets |

### A10. Integrations

- **Far EasTone Health⁺ Telemedicine Platform** — launch and monitor video consult sessions initiated from the Referral Management module.
- **Microlife and Bionime device data ingestion** — server-side endpoints receiving synced vitals data from the Mobile App's Bluetooth-paired devices.
- **Phase 2 (B2B) hooks** — the data model and role system are designed to extend to a private hospital patient-monitoring module (Section 7.4 of the business plan) without a structural rework, though that module's specific screens are out of scope for this specification.

---

## Part B — UI/UX Design Specification

### B0. Implementation Note — Existing UI Reference

> **Base the UI implementation on the existing `AImhotech-Web-Admin-1.html` file and the `ui/aimhotech_admin` folder.** These contain the current reference implementation/prototype and should be treated as the source of truth for markup structure, component styling, and layout conventions — the sections below (design tokens, typography, components, screens) describe the intended system, but where the existing HTML/UI folder already establishes a pattern, follow that pattern rather than reinterpreting from scratch.

### B1. Design Principles

- **Clinical clarity within the brand** — Uses the same Healing Green & Sage palette as the Mobile App, but leans more data-dense and structured, since its users are trained staff rather than the general public.
- **Scannable, not decorative** — Every dashboard prioritizes fast triage — a physician should be able to identify the day's most urgent cases within seconds of logging in.
- **Role-adaptive** — The same design system renders different information density and navigation depth depending on role, rather than showing and then hiding irrelevant modules.
- **Consistent with Mobile** — Shared color tokens and typography scale with the Mobile App ensure the platform feels like one product across surfaces.

### B2. Design System

#### Color Tokens (Shared with Mobile, Extended for Data Visualization)

| Token | Hex | Usage |
|---|---|---|
| Forest Green (Primary) | `#1E3A2F` | Navigation, headers, primary buttons |
| Sage (Accent) | `#A3B18B` | Active nav states, secondary actions, chart accents |
| Soft Cream (Surface) | `#F9F8F6` | Page and card backgrounds |
| Risk — Low | `#4C7A5A` | Low-risk rows/badges, dashboard "healthy" indicators |
| Risk — Moderate | `#C79A3C` | Moderate-risk rows/badges |
| Risk — Elevated | `#B0523F` | Elevated-risk rows/badges, urgent queue items |
| Data Table Zebra | `#F1EEE7` | Alternating table row background for scannability |
| Text Primary | `#24291F` | Body text |
| Text Secondary | `#6B7566` | Metadata |

#### Typography

| Style | Size | Weight | Usage |
|---|---|---|---|
| Page Title | 24px | Bold | Top of every module |
| Section Header | 18px | Semibold | Card and panel headers |
| Table Header | 13px | Semibold, uppercase | Data table column headers |
| Body / Table Cell | 14px | Regular | Primary data content |
| KPI Number | 32px | Bold | Dashboard summary metrics |

#### Core Components

- Sidebar Navigation (persistent, role-scoped module list, collapsible)
- KPI Card (large number, label, trend indicator)
- Data Table (sortable, filterable, zebra-striped, risk-badge column support)
- Risk Badge (identical token system to Mobile App for visual consistency)
- Status Stepper (referral lifecycle: Flagged → Referred → Seen → Resolved)
- Modal Form (patient detail edits, clinical validation submission, user provisioning)
- Toast/Inline Alert (save confirmations, validation errors, sync status)

### B3. Information Architecture

Sidebar navigation, scoped per role:

```
Dashboard → Patients → Risk Queue → Referrals → Clinical Validation (RHU Physician and above)
  → Devices (Super Admin) → Reports → Users (Super Admin) → Audit Log (Super Admin) → Settings
```

### B4. Key Screen Specifications

#### Login (Role-Based)
- **Purpose:** Authenticate staff into the correct role-scoped view of the platform.
- **Key Elements:** Email/username and password, optional future SSO entry point, role indicator shown post-login.
- **States:** Default, loading, error (invalid credentials), locked (excessive failed attempts).

#### Main Dashboard
- **Purpose:** Give any staff role an immediate, scannable view of population health status within their scope.
- **Key Elements:** KPI cards (screenings this month, elevated-risk %, referral completion rate), barangay-level risk heatmap, recent activity feed.
- **States:** Normal, no-data (new station/RHU), loading, filtered (by date range or facility).

#### Patient Registry & Detail View
- **Purpose:** Search for and review an individual patient's full cross-provider record within the caller's authorized scope.
- **Key Elements:** Search bar (ID/name/QR), patient summary header, screening history timeline, risk flag history, linked referrals.
- **States:** Search-empty, results list, detail view, restricted (attempted access outside role scope, handled server-side but reflected in UI as access-denied).

#### Risk Queue / Triage Worklist
- **Purpose:** The primary daily workflow for RHU physicians: a prioritized list of AI-flagged cases requiring review.
- **Key Elements:** Sortable/filterable table (risk level, patient, station, flagged date), bulk-action support, one-click drill into Patient Detail View.
- **States:** Empty (no pending cases), populated, filtered, case claimed/in-review by another user (concurrency indicator).

#### Referral Management
- **Purpose:** Track every referral from initial flag through resolution.
- **Key Elements:** Status stepper per referral, aging indicator on stalled referrals, facility and provider details, notes/history log.
- **States:** Flagged, referred, seen, resolved, stalled (aging beyond threshold, visually flagged).

#### Clinical Validation Panel
- **Purpose:** Let an RHU physician (or hospital partner) submit a clinically validated record, distinct from kiosk screening-grade data.
- **Key Elements:** License number entry, QR verification step, record detail confirmation, submit action.
- **States:** Awaiting verification, verified, verification failed (with retry), submitted.

#### Device & Kiosk Fleet Management
- **Purpose:** Give Hardy & Co. PH Ltd.'s operations team visibility into every deployed device across all stations.
- **Key Elements:** Device list with status (online/offline/maintenance-needed), facility assignment, pairing history, firmware version.
- **States:** All healthy, attention-needed (filtered view), device detail drill-down.

#### Reports & Analytics
- **Purpose:** Generate exportable reports for DOH, LGU, and internal stakeholders.
- **Key Elements:** Report type selector, date range and facility filters, preview pane, export (PDF/CSV) action.
- **States:** Configuration, generating, ready-to-download, error.

#### User & Role Management
- **Purpose:** Super Admin tooling to provision and manage all platform accounts.
- **Key Elements:** User list (searchable/filterable by role and facility), invite/create form, role and facility assignment, deactivation action.
- **States:** List view, create/edit form, deactivation confirmation.

#### Audit Log
- **Purpose:** Searchable, read-only record of platform access and data changes for compliance review.
- **Key Elements:** Filterable table (actor, action, entity, timestamp), detail expansion per entry, export action.
- **States:** Default (recent activity), filtered, empty (no matches).

### B5. Responsive and Tablet Considerations

Designed primarily for desktop use in RHU and DOH offices. Sidebar navigation collapses to an icon-only rail below **1024px**. All data tables become horizontally scrollable rather than truncating columns, to support RHU staff who may access the platform from a shared tablet.

### B6. Accessibility Considerations

- All KPI cards and risk badges pair color with text/icon labels, never color alone.
- Data tables support keyboard navigation and screen-reader-compatible markup.
- Minimum contrast ratio of **4.5:1** for all body text against its background, verified against the Healing Green & Sage palette.
- Form validation errors are announced inline and are not conveyed by color alone.

---

## Appendix — Open Questions for Engineering Kickoff

1. Confirm final backend framework choice (NestJS vs. FastAPI) in coordination with the Mobile App backend, since both clients share one API surface.
2. Confirm Supabase as the production database host, consistent with tooling already used across Hardy & Co. PH Ltd.'s portfolio, or evaluate alternatives if RA 10173 compliance review surfaces hosting-location requirements.
3. Define the exact aging threshold (e.g., 7 days) that marks a referral as "stalled" in the Referral Management module.
4. Confirm DOH single sign-on requirements, if any, before finalizing the authentication architecture in Section A8.
5. Scope the Phase 2 (B2B) hospital monitoring module's screens once hospital pilot conversations (Section 7.4 of the business plan) are further along.

---

*Source: Hardy & Co. PH Ltd. | AImhotech Web Admin Platform | Technical & UI/UX Specification, Document Version 1.0 — July 2026.*
