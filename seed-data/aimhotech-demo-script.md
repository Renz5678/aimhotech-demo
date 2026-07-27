# AImhotech Live Demo Script — "Maria Dela Cruz" Scenario

This is the presenter's walkthrough for the pitch. It uses `aimhotech-demo-seed-data.json`
as the shared source of truth — copy that file into **both** project directories
(`admin-dashboard/src/data/seed-data.json` and `mobile-view/src/data/seed-data.json`) so
both apps load consistent facilities, users, and patient history on startup.

**There is no real backend.** Every "sync" in this script is a manual presenter action
(a button click, a screen switch, or a hidden dev trigger) that reveals the next
pre-scripted record. To the audience it looks like one connected system.

---

## Before you start: what should already be on screen

Load both apps with the base seed data (everything in the JSON *except* `liveTriggerScenario`,
which is added live). This gives you:

- **Admin Dashboard** — Risk Queue already has 3-4 open cases (Rosalinda, Aurora, Randy) in
  different referral states (referred / flagged+stalled / seen), so the dashboard doesn't
  look empty or fake when you open it.
- **Mobile View (Health Worker Mode)** — station overview shows normal sync status, a
  small backlog, nothing alarming.
- **Mobile View (Patient Mode)** — pick one already-resolved patient (Jun Bermudez) to
  show what a *completed* referral loop looks like, before you show a live one.

This "warm" starting state matters — it proves the system already has history and isn't
a one-shot demo.

---

## Act 1 — The Screening (Health Worker Mode)

**Say:** "Let's walk through a new resident coming in for a screening — Maria Dela Cruz,
enrolled today at Barangay Commonwealth."

1. Open **mobile-view → Health Worker Mode → Patient Lookup**, search "Dela Cruz" — she's
   already enrolled (seed data), but has no screening history yet. This shows the
   "new patient, first screening" empty state.
2. Tap **New Screening → Device Pairing**. Walk through the pairing animation for the
   Microlife BP monitor.
3. Tap through to **Vitals Capture**. Reveal the pre-scripted reading: **BP 164/99, AFIB
   flag positive** (this is `SCR-LIVE-001` in the seed file — hardcode it as the result
   of this specific pairing flow, not randomly generated).
4. Submit the screening. The app shows the **Risk Result** screen with a clearly-labeled
   **"Provisional — On-Device"** badge and an elevated risk category. This is the moment
   to explicitly say: *"This ran with zero internet connection — the on-device AI already
   flagged her before we've synced anything."*

---

## Act 2 — The "Sync" (the trick)

**Say:** "Now let's say we've got a signal — the sync engine pushes this up to the AI Brain,
which has the full cross-provider picture."

1. Tap a **"Sync Now"** button (build this as a real, visible UI element in Health Worker
   Mode's Sync Status screen — it's in the actual spec, so it's not out of place). This
   is your trigger: clicking it doesn't call a network, it just flips a local state flag
   that reveals the next step.
2. Switch to the **admin-dashboard** browser tab/window. The **Risk Queue** should already
   be open. Have the new row for Maria Dela Cruz appear with a **highlight/pulse
   animation** (build this as a CSS transition keyed off the same trigger, e.g. a
   `localStorage` flag or just a manually-toggled state if the two apps are on the same
   machine — see "Implementation note" below).
3. **Say:** *"That case just appeared in the RHU physician's queue — confirmed by the AI
   Brain at 94% confidence, not the 79% we saw on-device, because the server has more
   history to cross-reference."*

---

## Act 3 — The Referral (Admin Dashboard)

1. Click into Maria Dela Cruz's row. Show the **Patient Detail View** with her (freshly
   created) screening and risk flag.
2. As **Dr. Carmela Ramos**, click **"Create Referral"** → destination: **St. Luke's
   Medical Center - QC**. Status stepper moves to **"Referred."**
3. **Say:** *"That referral was just created by a physician sitting in an RHU office. Let's
   check what the resident sees."*

---

## Act 4 — The Payoff (back to Mobile, Patient Mode)

1. Switch back to **mobile-view**, log in as **Maria Dela Cruz (Patient Mode)**.
2. Open **Appointments & Referral Tracker** — it now shows **"Referred"** with the
   facility name and date, matching exactly what was just created on the dashboard.
3. **Close on this line:** *"Same event. Three roles — health worker, physician, patient —
   one system. That loop, from kiosk to referral to resident, is the entire pitch."*

---

## Implementation note for the "sync" illusion

Since there's no real backend, pick ONE of these to make the cross-app trigger work
smoothly during a live pitch:

- **Simplest / safest:** Don't try to auto-sync the two apps at all. Advance each app's
  local state independently and just narrate the transition ("now let's check the
  dashboard") while you alt-tab. The audience never notices the seam if your narration
  bridges it.
- **Slightly fancier:** If both apps run in the same browser (e.g. two tabs on
  `localhost`), use the **`BroadcastChannel` API** or `localStorage` + a `storage` event
  listener so that clicking "Sync Now" in one tab actually pushes a message the other tab
  picks up and animates in. This is still "no real backend" (no server, no network call)
  but gives you the satisfying automatic reveal without a second click. Keep it simple —
  a single channel name like `aimhotech-demo-sync` broadcasting `{ type: "NEW_RISK_FLAG",
  patientId: "QC-097-00241" }` is enough.

Either approach is fine — the safest option is genuinely the first one. Don't over-engineer
the illusion at the cost of demo-day reliability.

---

## Supporting cast (already in seed data — use if you have time for a Q&A deep-dive)

- **Aurora Sinag** (`QC-133-00088`) — elevated risk, referral flagged 9 days ago and
  **stalled** — good for showing the aging-indicator / SLA feature if asked about referral
  follow-through.
- **Randy Oclarit** (`QC-024-00062`) — referral status "seen" — shows a mid-lifecycle case.
- **Jun Bermudez** (`QC-097-00229`) — referral "resolved" — shows what a fully closed loop
  looks like, useful for the Patient Mode "completed referral" state.
- **Corazon Malabanan** (`MRK-011-00033`) — has a **clinically validated** record (license +
  QR verification) — good if judges ask about the diagnostic-grade vs. screening-grade
  distinction (Section 4.3 of the business plan).