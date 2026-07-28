# AImhotech Operational Guide

This document outlines how to navigate and operate the AImhotech platform across all supported client types: **Patient**, **Health Worker**, and **Web Admin**.

---

## 1. Mobile Application (Progressive Web App)

The mobile view is a unified application that seamlessly switches between the Patient and Worker experiences based on the active session.

### A. Patient Client

The Patient interface is designed for simplicity, self-service, and remote monitoring.

**Key Operations:**
1. **Enrollment & Authentication:** 
   - New patients tap **"Start enrollment"** to review the consent flow.
   - Returning patients select **"Patient"**, enter their Patient ID and Phone Number, and authenticate via a 6-digit OTP.
2. **Dashboard Overview:** The home screen provides a personalized greeting, the day's active health tip, and a quick-action FAB (Floating Action Button) to connect with the AI Gabay Chat.
3. **Health History & Vitals:** 
   - Navigate to the **History** tab to review historical blood pressure and vitals trends. Filter the history list using the interactive chips at the top.
4. **Appointments & Reminders:** 
   - Navigate to **Visits** to view upcoming clinical instructions and appointments. Click "View Instructions" on the home screen to jump here directly.
5. **Settings & Sign Out:**
   - Go to the **Profile** tab to access the Help Center or safely **Sign Out** of the session.

### B. Health Worker (BHW) Client

The Worker interface is built for field efficiency, offline-first data capture, and hardware integration.

**Key Operations:**
1. **Authentication:** 
   - Select **"Worker"** on the login screen, enter the Worker ID, and authenticate via OTP.
2. **Dashboard Overview:** 
   - The worker home screen highlights pending tasks, sync status, and quick links to core workflows (New Screening, Patient Lookup).
3. **Conducting a Screening:**
   - Tap **"New Screening"** to initiate a field visit.
   - **Device Pairing:** Connect to Bluetooth clinical hardware (e.g., BP monitors).
   - **Vitals Capture:** The app will pull live data from the connected device.
   - **Risk Result:** Review the immediate AI-calculated risk stratification based on the captured vitals before confirming the patient.
4. **Patient Lookup:** 
   - Access the registry of local patients to view their histories or initiate a walk-in screening.
5. **Sync & Settings:** 
   - Navigate to the **Sync** tab to manage offline data payloads and force a sync with the central AImhotech Brain when an internet connection is available.
   - Use the **Settings** tab to unpair devices, configure app locks, and **Sign Out**.

---

## 2. Admin Dashboard (Web)

The Admin Dashboard is the centralized command center for RHU Physicians, DOH Officers, and System Administrators.

### C. Admin Client

**Key Operations:**
1. **Population Health Dashboard (`/`)**
   - **KPI Analysis:** Review top-level metrics (Total Screenings, Elevated Risks). Hover over KPI cards for interactive expansion.
   - **Barangay Heatmap:** Identify high-risk geographical zones at a glance.
   - **Data Filters:** Toggle between "This Week", "This Month", and "Last 3 Months" to re-calculate dashboard metrics dynamically.
2. **Patient Registry (`/patients`)**
   - **Searching & Filtering:** Use the search bar to locate specific patients by ID, Name, or Barangay. Use the Risk chips (Elevated, Moderate, Low) to filter the table.
   - **Slide-out Drawer:** Click any patient row to open a detailed slide-out overlay. This drawer provides deep clinical context without navigating away from the main registry table.
3. **Risk Queue & Referrals (`/risk-queue`, `/referrals`)**
   - Manage incoming flagged patients from field workers. Claim queue items, review clinical notes, and transition patients through the referral funnel (Flagged -> Referred -> Seen -> Resolved).
4. **Clinical Validation (`/clinical-validation`)**
   - Specifically for Physicians to review AI-generated risk scores and override them if clinical judgment dictates otherwise.
5. **Global Actions**
   - **Notifications:** Click the Bell icon in the top right header to view system alerts and system sync updates.
   - **Sidebar Navigation:** Use the left sidebar to jump between modules. The active module is clearly indicated with a vibrant green left-accent border.
   - **Settings & Logout:** Navigate to `/settings` (bottom of the sidebar) to configure dark mode, timeout durations, and safely **Sign out completely**.

---

*Note: The platform features responsive layouts and immersive micro-interactions across both the mobile and web experiences to ensure high usability in high-stress clinical environments.*
