# AImhotech — Simulation Guide

This guide gives you step-by-step simulation instructions for each of the three roles in the AImhotech system. Follow them in order (Health Worker → Admin → Patient) to see the full real-time data flow across both apps.

> **Before you start:**
> - Run both dev servers: `mobile-view` on `localhost:5173` and `admin-dashboard` on `localhost:3000`
> - Run `supabase-auth-migration.sql` and `supabase-notifications.sql` in your Supabase SQL Editor first
> - Have both apps open side by side (mobile in a narrow browser window, admin in a wide one)

---

## 👩‍⚕️ Role 1 — Barangay Health Worker (BHW)

**Goal:** Conduct a field screening, capture vitals, and create a referral that the physician will see in real-time.

**Login credentials:**
- Email: `m.delacruz@brgy.gov.ph`
- Password: `AimhoDemo2026!`

### Steps

1. **Sign in**
   - Open `localhost:5173`
   - On the login screen, tap the **Worker** tab
   - Enter the email and password above → tap **Sign in**
   - You land on the Worker Home screen showing today's screening count (starts at 0)

2. **Look up a patient**
   - Tap **New Screening** on the home screen
   - On the patient lookup screen, search for **"Maria Santos"** or scroll to find her
   - Tap her name to proceed to the **Confirm Patient** screen
   - You'll see her last seen date derived from real screening history

3. **Pair a device**
   - Tap **Pair Device** on the Device Pairing screen
   - Select **Microlife B6** (blood pressure monitor) and **Bionime iFree** (glucometer)
   - Tap **Continue to Vitals Capture**

4. **Capture vitals**
   - On the Vitals Capture screen, you'll see the pre-loaded abnormal reading:
     - BP: **164/99 mmHg** (editable — try changing it)
     - Heart Rate: **88 bpm**
     - Glucose: **128 mg/dL**
   - The AFIB warning banner appears automatically
   - Adjust the **Height** and **Weight** fields — BMI updates live
   - Tap **Confirm** on the unusual reading dialog, then tap **Analyze Risk**
   - A **Syncing to AI Brain...** overlay appears while the data is being written to Supabase
   - ✅ **Watch the Admin Dashboard at this moment** — the activity feed and Risk Queue update in real-time

5. **Review the risk result**
   - The Risk Assessment screen shows **Elevated Risk · 78% confidence**
   - The vitals grid shows the real values you just entered
   - Tap **Create Referral**
   - A bottom sheet opens with facilities pulled from Supabase — select one (e.g., **East Avenue Medical Center**)
   - Tap **Confirm Referral**
   - A green toast: **"Referral sent successfully!"** appears
   - You're returned to Worker Home — the "Screenings Today" count increases to **1**

6. **Sync pending records (optional)**
   - Tap the **Sync** tab in the bottom nav
   - If there are pending records queued, tap **Sync Now**
   - Watch the per-record progress bar as each record is uploaded

---

## 🖥️ Role 2 — RHU Physician / Admin

**Goal:** Review the incoming risk flag, validate the screening, manage the referral, and observe real-time updates from the field.

**Login credentials:**
- Email: `a.reyes@rhu.gov.ph`
- Password: `AimhoDemo2026!`

### Steps

1. **Sign in**
   - Open `localhost:3000`
   - Enter the email and password above → click **Sign In**
   - Your name and role (**Dr. Amelia Reyes · RHU Physician**) appear in the sidebar and settings

2. **See the live activity on the Dashboard home (`/`)**
   - The KPI cards show live counts: Total Patients, Total Screenings, Active Risk Flags, Pending Referrals
   - The **🟢 Live** indicator pulses in the activity feed header
   - After the BHW completes step 4 above, a new entry flashes in the activity feed:
     `"AI Brain flagged Maria Santos (San Isidro) — AFIB detected"`

3. **Check the Risk Queue (`/risk-queue`)**
   - The new flag for Maria Santos appears at the top with an **ELEVATED** badge
   - Click **Claim** — the status changes to **In Review · Dr. Reyes**
   - The claim writes to the `risk_flags` table in Supabase

4. **Review Patient Registry (`/patients`)**
   - Search for **"Maria Santos"**
   - Click her row to open the slide-out drawer
   - The **Screening History** tab shows her most recent screenings with real BP/glucose values
   - Click **New Clinical Entry** to log an observation

5. **Validate the screening in Clinical Validation (`/clinical-validation`)**
   - The pending queue is populated from real unvalidated screenings
   - Your **PRC License** (`PRC-0142891`) is pre-filled from your session
   - Select Maria Santos' screening from the list
   - Click **Scan QR** to simulate scanning your physician ID
   - Once verified, click **Submit Validation**
   - A success toast appears and the entry moves to "Recently Validated"
   - A new entry is written to the `activity_feed` in Supabase

6. **Manage the Referral (`/referrals`)**
   - Navigate to Referrals
   - Find the referral created by the BHW (it will appear at the top — `REF-LIVE-...`)
   - Click **Mark as Seen** to advance it to stage 2
   - ✅ **At this moment, watch the Patient app** — the Appointments tab stage tracker updates live
   - Click **Mark as Resolved** to close the loop

7. **Check the AI Brain (`/aibrain`)**
   - New anomalies from this screening session may appear
   - Click **Acknowledge** on any open anomaly — it writes `status: ack` to Supabase immediately
   - The **open flag count** badge at the top decreases

8. **Export a report (`/reports`)**
   - Click **Generate Report** on any report type
   - Click **EXPORT CSV** — a real CSV file downloads with all screening records

9. **Audit Log (`/audit-log`)**
   - All actions are visible (screening submission, validation, referral updates)
   - Click **Export CSV** to download the real audit trail as a file

---

## 📱 Role 3 — Patient

**Goal:** Experience the system from the patient's perspective — see your risk status update, check your referral, and receive real-time notifications when the physician acts on your record.

**Login (Demo shortcut — no real SMS needed):**
- Select **Patient** tab on the mobile login screen
- Patient ID: `BGY-041-00217`
- Enter any 6 digits in the OTP screen → tap **Verify & login**
- The app uses password authentication behind the scenes for this demo account

### Steps

1. **Sign in as the demo patient**
   - Open `localhost:5173`
   - Tap the **Patient** tab
   - Enter Patient ID: `BGY-041-00217`
   - Enter any phone number (e.g., `09123456789`)
   - Tap **Text me a code**
   - Enter any 6 digits → tap **Verify & login**
   - You land on the Patient Home screen as **Maria Santos**

2. **Review the Home screen**
   - The greeting changes based on time of day: **"Good morning/afternoon/evening, Maria!"**
   - The **Risk Status card** reflects the latest AI flag from the BHW's screening:
     - Before BHW step 4: shows **Low Risk** (default)
     - After BHW step 4: shows **Elevated Risk** (live from Supabase)
   - The **Upcoming Appointment card** shows the referral facility name once the BHW creates the referral
   - The **Health Tip** is pulled from the store

3. **Check Health History**
   - Tap the bottom nav **History** tab (or equivalent)
   - The list shows all real screenings for this patient from Supabase, sorted by most recent
   - The **Blood Pressure trend chart** is plotted from the last 6 real BP readings — you'll see the spike from the latest screening
   - The **pending badge** shows the count of unresolved referrals

4. **Check Appointments**
   - Tap the **Appointments** tab
   - The referral card shows the real destination facility chosen by the BHW
   - The **status stepper** reflects the current stage:
     - 🔴 Flagged → 🟡 Referred → 🟢 Seen → ✅ Resolved
   - When the physician clicks **Mark as Seen** in the admin dashboard, this updates live here
   - Tap **Refresh** to call `hydrateFromSupabase()` manually if needed

5. **Check the Notification Bell**
   - Tap the bell icon in the top right
   - New notifications arrive in real-time whenever the admin system creates a cross-app event
   - When the physician creates or updates a referral, a notification appears here without refreshing

6. **Talk to Gabay AI**
   - Tap the **Gabay** tab
   - Type a health question in Filipino or English
   - The AI assistant provides context-aware advice (currently simulated response; indicates on-device model status)

7. **Settings**
   - Tap the gear icon or settings tab
   - Your consent date and profile info are shown
   - Language can be toggled between English and Filipino
   - **Sign Out** → calls `supabase.auth.signOut()` and returns to the login screen

---

## 🔁 Full Round-Trip Checklist

Use this checklist to confirm the end-to-end real-time data flow is working:

- [ ] BHW completes vitals capture → activity feed entry appears on admin dashboard within 2 seconds
- [ ] BHW creates referral → Appointments tab on patient app shows the facility name
- [ ] Admin claims a risk flag → Risk Queue badge updates
- [ ] Admin marks referral "Seen" → Patient Appointments stage tracker advances to step 3
- [ ] Admin marks referral "Resolved" → Patient Appointments shows ✅ Resolved
- [ ] Admin submits clinical validation → Audit Log gains a new entry
- [ ] Notification bell on patient app shows new entries when admin pushes cross-app events
