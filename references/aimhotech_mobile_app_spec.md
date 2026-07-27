# AImhotech Mobile App — Technical & UI/UX Specification

**Product:** AImhotech Mobile App (aimhotech.io)
**Product Line:** AImhotech — a standalone venture of Hardy & Co. PH Ltd.
**Submitting Organization:** Hardy & Co. PH Ltd.
**Prepared by:** Daniel Scaparro, Founder & CEO
**Document Version:** 1.0 — July 2026
**Audience:** Patient Companion App and Barangay Health Worker Field Capture Tool

---

## Objectives

The AImhotech Mobile App is the **primary point-of-care interface** for the AImhotech platform. It runs in two distinct operating modes on the same codebase:

- **Patient Mode** — used directly by residents to view their own aggregated health record, risk status, and appointments.
- **Health Worker Mode** — used by trained barangay health workers and midwives at kiosk devices to conduct screenings, pair Taiwan Excellence-awarded hardware, and submit data into the AI Brain.

The app is the **client-side counterpart to the AImhotech Web Admin Platform** (separate spec), and both share the same backend API and AI Brain services.

The app is designed **offline-first from the ground up**, since many barangay health stations operate in low-bandwidth or intermittently connected areas. Every core workflow — screening capture, risk scoring, and record viewing — must function fully without a live internet connection, syncing automatically once connectivity is available.

---

## Part A — Technical Specification

### A1. Overview

See Objectives above.

### A2. User Roles and Modes

| Role | App Mode | Key Capabilities |
|---|---|---|
| Resident / Patient | Patient Mode | View personal risk score and history, appointment and referral tracking, health education content, consent management, join telemedicine calls |
| Barangay Health Worker / Midwife | Health Worker Mode | Conduct new screenings, pair Bluetooth devices, capture vitals, view AI risk flag, initiate referrals, manage sync queue |
| Hardy & Co. PH Ltd. Field Support (internal) | Health Worker Mode (elevated) | Device diagnostics, station-level sync troubleshooting, app version/config management |

### A3. System Architecture

Layered **offline-first architecture**. The presentation layer (screens and navigation) reads and writes exclusively to a local on-device database, **never directly to the network**. A background sync engine reconciles the local database with the central AImhotech backend whenever connectivity is available. On-device AI inference provides an immediate, provisional risk flag even while offline; this flag is reconciled against the full AI Brain's server-side scoring once synced, and any discrepancy is surfaced to the health worker rather than silently overwritten.

| Layer | Responsibility | Connects To |
|---|---|---|
| Presentation (Screens/Navigation) | Renders UI, handles user input for both app modes | Local Database only |
| Local Database | Offline-first store of patients, screenings, risk flags, referrals, consent records | Sync Engine, On-Device AI |
| On-Device AI (Edge Inference) | Runs a lightweight, quantized triage model for immediate offline risk scoring | Local Database |
| Bluetooth Device Layer | Pairs and reads data from Microlife BP monitor and Bionime CGM | Local Database |
| Sync Engine | Queues and reconciles local changes with the backend when online | Backend API |
| Backend API (shared with Web Admin) | Central AI Brain, patient registry, referral routing, reporting | Cloud Database, Far EasTone Health⁺ |

### A4. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Cross-platform framework | **React Native (Expo)** | Single codebase for Android and iOS; Android prioritized given device distribution in rural Philippines; large ecosystem for offline-first and BLE libraries |
| Local storage | **WatermelonDB (SQLite-backed)** | Purpose-built for offline-first apps with built-in sync adapters and reactive queries |
| State management | **Redux Toolkit** | Predictable state handling across Patient Mode and Health Worker Mode |
| On-device AI inference | **TensorFlow Lite / ONNX Runtime Mobile** | Runs a quantized version of the AI Brain triage model locally; target model size under 50MB |
| Bluetooth integration | **react-native-ble-plx** | Pairing and data capture from Microlife B6 Connect and Bionime RIGHTEST iFree devices |
| Backend API | **Node.js (NestJS)** or **Python (FastAPI)** | Shared backend serving both mobile and web admin clients; REST plus event-based sync endpoints |
| Authentication | **Unique Patient ID + QR / Phone OTP** | Consistent with the clinical validation workflow already defined for the platform |
| Push notifications | **Firebase Cloud Messaging** | Risk alerts, appointment and referral reminders |
| Crash reporting / analytics | **Sentry** | Field reliability monitoring for low-connectivity, high-variance device environments |
| Build and release | **EAS Build (Expo Application Services) + GitHub Actions** | Managed cross-platform builds and CI/CD without maintaining native build servers |

### A5. Data Model (Key Entities)

| Entity | Key Fields | Notes |
|---|---|---|
| Patient | Unique Patient ID (barangay area-code prefix), name, DOB, sex, consent status | Mirrors the identification scheme defined in the platform architecture |
| Screening Record | Patient ID, vitals (BP, glucose), timestamp, health worker ID, device ID, sync status | Created in Health Worker Mode; screening-grade, not diagnostic-grade |
| Risk Flag | Patient ID, risk score, category, confidence, source (on-device / AI Brain), recommended action | On-device flags are marked provisional until reconciled with the server |
| Device Pairing | Device ID, device type (Microlife / Bionime), patient linkage, last calibration | Supports multi-device kiosks and device reassignment |
| Referral | Patient ID, risk flag ID, destination facility, status (flagged/referred/seen/resolved) | Status changes sync bidirectionally with the Web Admin referral tracker |
| Consent Record | Patient ID, scope, timestamp, method (in-app / verbal-witnessed) | Re-confirmable at any time per Section 4.4 of the business plan |
| Sync Queue Item | Entity type, entity ID, operation, retry count, last attempt | Drives the background sync engine; not user-visible except as a status indicator |

### A6. API Integration Points

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/v1/patients/{id}` | GET / PUT | Retrieve or update a patient's core record |
| `/api/v1/screenings` | POST | Submit a completed screening record |
| `/api/v1/risk-flags/{patientId}` | GET | Retrieve the latest AI Brain risk assessment for a patient |
| `/api/v1/referrals` | POST / GET | Create or retrieve referral records |
| `/api/v1/consent` | POST | Record or update a consent event |
| `/api/v1/sync/pull` | GET | Pull server-side changes since last sync checkpoint |
| `/api/v1/sync/push` | POST | Push queued local changes to the server |
| Bluetooth GATT profile | N/A (BLE) | Direct device pairing with Microlife B6 Connect and Bionime RIGHTEST iFree |
| Far EasTone Health⁺ SDK | N/A (SDK) | Launches telemedicine video consult sessions from within the app |

### A7. Offline-First and Sync Strategy

All writes happen locally first and are queued for sync; the user is never blocked waiting on a network call. Sync runs opportunistically in the background whenever connectivity is detected, using a **delta-sync** approach that transmits only changed records. Conflict resolution follows a **last-write-wins policy at the field level**, with a full audit trail retained server-side so that any conflicting edits remain recoverable rather than silently discarded. On-device AI risk flags are always labeled as **provisional** in the UI until reconciled against the server-side AI Brain, so a health worker is never misled into treating an offline-only assessment as final.

### A8. On-Device AI Specification

The on-device model is a **distilled, quantized version of the AI Brain's triage logic**, purpose-built for edge inference rather than a full general-purpose language model.

- Target model footprint: **under 50MB**
- Inference latency: **under 500ms** on a mid-range Android device (2GB RAM class)
- **No dependency on cloud connectivity** for a first-pass risk category (low / moderate / elevated)

When connectivity is available, the full server-side AI Brain reprocesses the same screening data with access to cross-provider history (Section 4.3 of the business plan), which may refine the risk category; any change is flagged to the health worker and, where relevant, the patient.

### A9. Security and Privacy

- **Encryption at rest:** Local database encrypted using SQLCipher; device-level encryption required as a baseline (enforced via app policy).
- **Encryption in transit:** All API and sync traffic over TLS 1.3.
- **Consent-first data capture:** No screening or aggregation occurs without a recorded consent event, per Section 4.4 of the business plan.
- **Per-role access control:** Patient Mode never exposes other patients' data; Health Worker Mode is scoped to the health worker's assigned station/barangay.
- **App lock:** PIN or biometric app lock required in Health Worker Mode given shared kiosk device usage.
- **Regulatory alignment:** Data handling designed for consistency with the **Philippine Data Privacy Act (RA 10173)**.

### A10. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Minimum OS support | Android 8.0+ (covers the large majority of budget devices in circulation in rural Philippines); iOS 14+ for Patient Mode |
| Minimum device RAM | 2GB |
| App package size | Under 80MB (excluding on-device AI model, downloaded on first launch) |
| Offline functionality | 100% of screening capture and record viewing must work with zero connectivity |
| Sync latency (when online) | Under 30 seconds for a single screening record |
| Battery impact | Background sync throttled to avoid meaningful battery drain on all-day kiosk use |
| Crash-free session rate target | ≥ 99% |

### A11. Notifications and Reminders

- **Patient Mode:** push notifications for new risk flags, upcoming appointments, and referral status changes.
- **Health Worker Mode:** in-app (not push) notifications for pending sync items and device pairing issues, since kiosk devices are typically shared and not tied to a single notifiable user.

### A12. Localization

Launch languages are **English** and **conversational, everyday Filipino (Tagalog)**, matching the language-level standard already established for AImhotech's voice and text content — understandable by a normal Filipino user rather than deep or formal Tagalog. The app architecture supports adding regional languages (e.g., Cebuano, Ilocano) in later phases without a structural rework.

### A13. Development Roadmap Alignment

Designed to be implemented incrementally, starting with the Health Worker Mode proof of concept already in progress (Section 12.1 of the business plan). Recommended build order:

1. **Health Worker Mode MVP** — device pairing, screening capture, on-device risk flag, basic sync
2. **Patient Mode** — read-only health record view, appointment tracking
3. **Telemedicine integration and push notifications**
4. **Phase 2 hooks** for the private hospital B2B module once that business line is scoped

---

## Part B — UI/UX Design Specification

### B0. Implementation Note — Existing UI Reference

> **Base the UI implementation on the existing `AImhotech-App-2.html` file and the `aimhotech_mobile` folder.** These contain the current reference implementation/prototype and should be treated as the source of truth for markup structure, component styling, and layout conventions — the sections below (design tokens, typography, components, screens) describe the intended system, but where the existing HTML/UI folder already establishes a pattern, follow that pattern rather than reinterpreting from scratch.

### B1. Design Principles

- **Calming and organic** — Visual language follows the Healing Green & Sage palette throughout (forest green, sage, soft cream), avoiding clinical, sterile whites and harsh reds except where medically meaningful (risk indicators).
- **Accessible by default** — Large tap targets (minimum 44x44pt), high-contrast text, icon-forward navigation to support users with lower digital or health literacy, including elderly residents.
- **Minimal cognitive load** — Health Worker Mode screening flow is a linear, single-path wizard; no more than one primary decision per screen.
- **Trustworthy, not alarming** — Risk results are communicated calmly and constructively, never with panic-inducing color or language, consistent with the platform's care-first brand voice.

### B2. Design System

#### Color Tokens

| Token | Hex | Usage |
|---|---|---|
| Forest Green (Primary) | `#1E3A2F` | Headers, primary buttons, key text |
| Sage (Accent) | `#A3B18B` | Secondary actions, active states, icons |
| Soft Cream (Surface) | `#F9F8F6` | Backgrounds, cards |
| Risk — Low | `#4C7A5A` | Low-risk result badges (deep sage-green) |
| Risk — Moderate | `#C79A3C` | Moderate-risk result badges (warm amber, on-palette) |
| Risk — Elevated | `#B0523F` | Elevated-risk result badges (muted terracotta, deliberately not a harsh alarm red) |
| Text Primary | `#24291F` | Body copy |
| Text Secondary | `#6B7566` | Captions, metadata |

#### Typography

| Style | Size | Weight | Usage |
|---|---|---|---|
| Display | 28sp | Bold | Screen titles, risk result headline |
| Heading | 20sp | Semibold | Section headers within a screen |
| Body | 16sp | Regular | Primary reading text |
| Caption | 13sp | Regular | Metadata, timestamps, helper text |
| Button Label | 16sp | Semibold | All button and tab labels |

#### Core Components

- Primary Button (filled forest green, cream text, full-width on mobile)
- Secondary Button (outlined sage, forest green text)
- Risk Badge (pill-shaped, color-coded per risk token above, icon + label)
- Vitals Input Card (large numeric entry, device-paired auto-fill indicator)
- Bottom Tab Navigation (4 items max per mode, icon + label)
- Sync Status Indicator (persistent small badge: synced / pending / offline)
- Consent Toggle Card (plain-language explanation + explicit opt-in switch)

### B3. Information Architecture

**Patient Mode Navigation**
```
Home → My Health (risk status, history/trends) → Appointments (referrals, telemedicine) → Settings (language, notifications, consent management)
```

**Health Worker Mode Navigation**
```
Home (station overview, sync status) → New Screening (device pairing → vitals capture → risk result → referral action)
  → Patient Lookup (search/registry) → Settings (device management, app config)
```

### B4. Key Screen Specifications

#### Onboarding & Consent
- **Purpose:** First-run experience explaining what AImhotech does with a resident's data and capturing explicit, informed consent before any data capture occurs.
- **Key Elements:** Plain-language explanation (3 short screens max), consent toggle card, language selector, "what happens to my data" expandable detail.
- **States:** First-run only; re-accessible anytime from Settings for consent review or withdrawal.

#### Login (Patient ID / Phone OTP)
- **Purpose:** Authenticate a returning resident (Patient Mode) or a health worker (Health Worker Mode) into the correct app context.
- **Key Elements:** Patient ID or phone number entry, OTP field, mode indicator, "new here?" enrollment path linking to Onboarding.
- **States:** Default, loading (OTP sent), error (invalid code), offline (cached-credential login for returning health workers).

#### Patient Mode: Home Dashboard
- **Purpose:** At-a-glance view of the resident's current health status and next steps.
- **Key Elements:** Risk status card (color-coded badge + one-sentence explanation), next appointment card, one featured health tip, quick link to full history.
- **States:** No-data (new patient, encouraging first-screening prompt), normal, elevated-risk (softly emphasized, with a clear "what to do next" action).

#### Patient Mode: Health History / Trends
- **Purpose:** Show the resident their vitals and risk trend over time across all providers (kiosk, RHU, participating hospitals).
- **Key Elements:** Simple line/trend chart per vital, chronological screening list, source tag per entry (kiosk / RHU / hospital).
- **States:** Empty state for new patients, populated state, single-entry state (no trend line yet).

#### Patient Mode: Appointments & Referral Tracker
- **Purpose:** Track the status of any referral generated from a risk flag, and join scheduled telemedicine consults.
- **Key Elements:** Status stepper (Flagged → Referred → Seen → Resolved), facility and date details, "Join Video Consult" button when applicable.
- **States:** No active referral, active referral (each stepper stage), completed referral (archived).

#### Health Worker Mode: New Screening — Device Pairing
- **Purpose:** Pair the kiosk's Bluetooth vitals devices to the current screening session.
- **Key Elements:** Device scan list, pairing status per device (Microlife BP monitor, Bionime CGM where applicable), manual entry fallback if pairing fails.
- **States:** Scanning, paired, pairing failed (with manual entry fallback), already-paired (reuse from prior session).

#### Health Worker Mode: New Screening — Vitals Capture
- **Purpose:** Capture and confirm vitals readings for the patient being screened.
- **Key Elements:** Auto-filled values from paired devices, manual override fields, patient ID confirmation, "submit screening" primary action.
- **States:** Awaiting device data, values received, manual entry mode, validation error (out-of-range value confirmation prompt).

#### Health Worker Mode: Risk Result
- **Purpose:** Present the AI Brain's (or on-device provisional) risk assessment and the recommended next action to the health worker.
- **Key Elements:** Risk badge, plain-language summary, provisional-vs-confirmed indicator, one-tap "create referral" action.
- **States:** On-device provisional result, server-confirmed result, result changed after sync (explicit callout).

#### Health Worker Mode: Patient Lookup
- **Purpose:** Search and retrieve an existing patient record before starting a new screening.
- **Key Elements:** Search by Patient ID, name, or QR scan; recent patients list; "new patient" enrollment shortcut.
- **States:** Empty search, results list, no-match (offer new enrollment), offline (search limited to locally cached records).

#### Shared: Sync Status
- **Purpose:** Give health workers visibility into what has and has not synced to the central platform.
- **Key Elements:** Pending item count, last successful sync timestamp, manual "sync now" action, per-item retry on failure.
- **States:** All synced, pending items, sync in progress, sync error (with retry).

### B5. Accessibility Considerations

- Minimum tap target size of **44x44pt** across all interactive elements.
- Color is never the sole indicator of risk level; every risk badge pairs color with an icon and text label.
- Text scales with system-level font size settings; no fixed-size text that ignores accessibility settings.
- All screens are usable one-handed where feasible, given field use on kiosk tablets and personal phones alike.
- Screening flow avoids jargon; risk explanations are written at a plain-language, everyday-Filipino reading level.

---

## Appendix — Open Questions for Engineering Kickoff

1. Confirm final choice between React Native and Flutter based on the team's existing skill set and the Mac app proof of concept already underway (Section 12.1 of the business plan).
2. Confirm whether Patient Mode and Health Worker Mode ship as one app with a mode switch, or as two separate app builds sharing a common codebase — this affects app store listing strategy and onboarding flow.
3. Finalize the on-device AI model's exact architecture and quantization approach with whoever owns AI Brain model development, to lock down the 50MB / 500ms targets in Section A8.
4. Confirm Far EasTone Health⁺'s actual SDK/API availability and integration requirements once partner conversations (Section 12.1) are further along.
5. Validate minimum Android OS/RAM targets against actual device data from candidate pilot barangays before final device-compatibility sign-off.

---

*Source: Hardy & Co. PH Ltd. | AImhotech Mobile App | Technical & UI/UX Specification, Document Version 1.0 — July 2026.*
