# Medical Billing & Management - Complete Implementation Plan

## Overview
The Medical Billing & Management module is designed to handle end-to-end healthcare revenue cycle operations including patient registration, appointment scheduling, insurance verification, medical coding (ICD/CPT), claims generation and submission, payment posting, denial management, and comprehensive revenue analytics. This module integrates seamlessly with the existing CRM system to provide a unified healthcare practice management solution.

**Status**: PENDING
**Priority**: High
**Module Category**: Healthcare & Revenue Cycle Management

---

## 🏗️ Module Architecture

### Core Components & Services:
- **UI Components**: Tables with CRUD operations for patients, appointments, claims, and payments
- **Services**: API integration layer for healthcare data operations, insurance eligibility checks, and claims processing
- **State Management**: React hooks with real-time claim status notifications
- **Features**: Advanced filtering, medical coding lookup, claim scrubbing, ERA auto-posting
- **Icons**: React-icons for healthcare visualizations
- **Styling**: Tailwind CSS with healthcare-themed color schemes (clinical blues, greens)

---

## 📊 Database Schema

### 1. Patients Collection

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `_id` | ObjectId | Yes | Unique patient ID | `60f7b1a2c4d3e8f9a0b1c2d3` |
| `patient_id` | String | Yes | Medical record number | `MRN-2026-001` |
| `first_name` | String | Yes | Patient first name | `John` |
| `last_name` | String | Yes | Patient last name | `Doe` |
| `date_of_birth` | Date | Yes | Patient DOB | `1985-03-15` |
| `gender` | Enum | Yes | Male \| Female \| Other \| Unknown | `Male` |
| `phone` | String | Yes | Primary contact number | `+1-555-0123` |
| `email` | String | No | Patient email | `john.doe@email.com` |
| `address` | Object | Yes | `{street, city, state, zip, country}` | `{...}` |
| `emergency_contact` | Object | No | `{name, phone, relationship}` | `{...}` |
| `insurance_primary` | ObjectId | No | Primary insurance ID | `60f7b1a2c4d3e8f9a0b1c2d4` |
| `insurance_secondary` | ObjectId | No | Secondary insurance ID | `60f7b1a2c4d3e8f9a0b1c2d5` |
| `assigned_provider` | ObjectId | No | Primary care provider | `60f7b1a2c4d3e8f9a0b1c2d6` |
| `patient_status` | Enum | Yes | Active \| Inactive \| Deceased | `Active` |
| `createdAt` | Date | Yes | Creation timestamp | `2026-04-20T10:30:00Z` |
| `updatedAt` | Date | Yes | Last modified timestamp | `2026-04-22T15:45:00Z` |

### 2. Providers / Physicians Collection

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `_id` | ObjectId | Yes | Unique provider ID | `60f7b1a2c4d3e8f9a0b1c2d6` |
| `provider_id` | String | Yes | Provider identifier | `PROV-2026-001` |
| `first_name` | String | Yes | Provider first name | `Dr. Sarah` |
| `last_name` | String | Yes | Provider last name | `Smith` |
| `npi_number` | String | Yes | National Provider Identifier | `1234567890` |
| `taxonomy_code` | String | No | Provider taxonomy/specialty code | `207Q00000X` |
| `specialty` | String | Yes | Medical specialty | `Family Medicine` |
| `license_number` | String | Yes | State license number | `MD-98765` |
| `license_state` | String | Yes | Licensing state | `CA` |
| `phone` | String | Yes | Office phone | `+1-555-0199` |
| `email` | String | Yes | Professional email | `s.smith@clinic.com` |
| `facility_address` | Object | Yes | Practice location address | `{...}` |
| `status` | Enum | Yes | Active \| Inactive \| Suspended | `Active` |
| `createdAt` | Date | Yes | Creation timestamp | `2026-04-20T10:30:00Z` |

### 3. Appointments Collection

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `_id` | ObjectId | Yes | Unique appointment ID | `60f7b1a2c4d3e8f9a0b1c2d7` |
| `appointment_id` | String | Yes | Appointment identifier | `APT-2026-001` |
| `patient_id` | ObjectId | Yes | Associated patient | `60f7b1a2c4d3e8f9a0b1c2d3` |
| `provider_id` | ObjectId | Yes | Scheduled provider | `60f7b1a2c4d3e8f9a0b1c2d6` |
| `appointment_date` | Date | Yes | Date of appointment | `2026-04-25` |
| `start_time` | String | Yes | Start time (HH:MM) | `09:00` |
| `end_time` | String | Yes | End time (HH:MM) | `09:30` |
| `appointment_type` | Enum | Yes | New_Patient \| Follow_Up \| Consultation \| Procedure \| Telehealth | `Follow_Up` |
| `status` | Enum | Yes | Scheduled \| Confirmed \| Checked_In \| In_Progress \| Completed \| Cancelled \| No_Show | `Scheduled` |
| `reason_for_visit` | String | Yes | Chief complaint or reason | `Annual physical exam` |
| `notes` | String | No | Additional notes | `Patient requested early morning slot` |
| `checked_in_at` | Date | No | Check-in timestamp | `2026-04-25T08:55:00Z` |
| `checked_out_at` | Date | No | Check-out timestamp | `2026-04-25T09:35:00Z` |
| `created_by` | ObjectId | Yes | User who scheduled | `60f7b1a2c4d3e8f9a0b1c2d8` |
| `createdAt` | Date | Yes | Creation timestamp | `2026-04-20T10:30:00Z` |

### 4. Insurance Plans Collection

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `_id` | ObjectId | Yes | Unique insurance ID | `60f7b1a2c4d3e8f9a0b1c2d4` |
| `payer_id` | String | Yes | Payer identifier | `PAYER-2026-001` |
| `payer_name` | String | Yes | Insurance company name | `Blue Cross Blue Shield` |
| `payer_type` | Enum | Yes | Commercial \| Medicare \| Medicaid \| Self_Pay \| Workers_Comp | `Commercial` |
| `plan_name` | String | Yes | Specific plan name | `BCBS PPO Gold` |
| `group_number` | String | No | Group/policy number | `GRP-123456` |
| `payer_address` | Object | No | Claims mailing address | `{...}` |
| `payer_phone` | String | No | Payer contact number | `+1-800-555-0199` |
| `electronic_id` | String | No | Electronic payer ID (for EDI) | `12345` |
| `is_active` | Boolean | Yes | Plan active status | `true` |
| `createdAt` | Date | Yes | Creation timestamp | `2026-04-20T10:30:00Z` |

### 5. Patient Insurance Eligibility Collection

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `_id` | ObjectId | Yes | Unique record ID | `60f7b1a2c4d3e8f9a0b1c2d9` |
| `patient_id` | ObjectId | Yes | Associated patient | `60f7b1a2c4d3e8f9a0b1c2d3` |
| `insurance_id` | ObjectId | Yes | Insurance plan | `60f7b1a2c4d3e8f9a0b1c2d4` |
| `policy_number` | String | Yes | Member policy ID | `POL987654321` |
| `subscriber_name` | String | Yes | Primary subscriber name | `John Doe` |
| `relationship_to_subscriber` | Enum | Yes | Self \| Spouse \| Child \| Other | `Self` |
| `coverage_start_date` | Date | Yes | Coverage effective date | `2026-01-01` |
| `coverage_end_date` | Date | No | Coverage expiration | `2026-12-31` |
| `copay_amount` | Number | No | Office visit copay | `25.00` |
| `deductible_amount` | Number | No | Annual deductible | `1500.00` |
| `deductible_met` | Number | No | Deductible fulfilled | `300.00` |
| `out_of_pocket_max` | Number | No | Out-of-pocket maximum | `5000.00` |
| `verification_date` | Date | No | Last eligibility check | `2026-04-20` |
| `verification_status` | Enum | Yes | Active \| Inactive \| Pending_Verification | `Active` |
| `createdAt` | Date | Yes | Creation timestamp | `2026-04-20T10:30:00Z` |

### 6. Encounters / Visits Collection

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `_id` | ObjectId | Yes | Unique encounter ID | `60f7b1a2c4d3e8f9a0b1c2da` |
| `encounter_id` | String | Yes | Encounter identifier | `ENC-2026-001` |
| `patient_id` | ObjectId | Yes | Associated patient | `60f7b1a2c4d3e8f9a0b1c2d3` |
| `appointment_id` | ObjectId | No | Linked appointment | `60f7b1a2c4d3e8f9a0b1c2d7` |
| `provider_id` | ObjectId | Yes | Attending provider | `60f7b1a2c4d3e8f9a0b1c2d6` |
| `encounter_date` | Date | Yes | Date of service | `2026-04-25` |
| `encounter_type` | Enum | Yes | Office_Visit \| Telehealth \| Inpatient \| Emergency \| Procedure | `Office_Visit` |
| `place_of_service` | String | Yes | POS code | `11` (Office) |
| `chief_complaint` | String | Yes | Primary reason for visit | `Chest pain and shortness of breath` |
| `diagnosis_codes` | Array | Yes | ICD-10-CM codes [{code, description, type}] | `[{code: 'I25.10', ...}]` |
| `procedure_codes` | Array | Yes | CPT/HCPCS codes [{code, description, units, modifier, charge}] | `[{code: '99213', ...}]` |
| `total_charge` | Number | Yes | Total encounter charge | `250.00` |
| `notes` | String | No | Clinical notes summary | `Patient stable, advised follow-up` |
| `status` | Enum | Yes | Open \| Ready_For_Billing \| Billed \| Paid \| Closed | `Ready_For_Billing` |
| `created_by` | ObjectId | Yes | User who documented | `60f7b1a2c4d3e8f9a0b1c2d8` |
| `createdAt` | Date | Yes | Creation timestamp | `2026-04-25T10:30:00Z` |
| `updatedAt` | Date | Yes | Last modified timestamp | `2026-04-25T15:45:00Z` |

### 7. Claims Collection

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `_id` | ObjectId | Yes | Unique claim ID | `60f7b1a2c4d3e8f9a0b1c2db` |
| `claim_id` | String | Yes | Claim identifier | `CLM-2026-001` |
| `encounter_id` | ObjectId | Yes | Linked encounter | `60f7b1a2c4d3e8f9a0b1c2da` |
| `patient_id` | ObjectId | Yes | Billed patient | `60f7b1a2c4d3e8f9a0b1c2d3` |
| `provider_id` | ObjectId | Yes | Billing provider | `60f7b1a2c4d3e8f9a0b1c2d6` |
| `primary_insurance_id` | ObjectId | Yes | Primary payer | `60f7b1a2c4d3e8f9a0b1c2d4` |
| `secondary_insurance_id` | ObjectId | No | Secondary payer | `60f7b1a2c4d3e8f9a0b1c2d5` |
| `claim_date` | Date | Yes | Date claim created | `2026-04-26` |
| `service_date_from` | Date | Yes | Date of service start | `2026-04-25` |
| `service_date_to` | Date | No | Date of service end | `2026-04-25` |
| `total_charge` | Number | Yes | Total billed amount | `250.00` |
| `amount_paid` | Number | No | Total payments received | `180.00` |
| `adjustment_amount` | Number | No | Write-offs/adjustments | `20.00` |
| `patient_responsibility` | Number | No | Patient owes | `50.00` |
| `claim_status` | Enum | Yes | Draft \| Submitted \| Pending \| Accepted \| Rejected \| Denied \| Partially_Paid \| Paid \| Appeal | `Submitted` |
| `claim_type` | Enum | Yes | Professional \| Institutional | `Professional` |
| `submission_method` | Enum | Yes | Electronic \| Paper | `Electronic` |
| `clearinghouse_reference` | String | No | Clearinghouse tracking ID | `CH-REF-12345` |
| `denial_reason` | String | No | Reason if denied | `Missing modifier` |
| `denial_code` | String | No | CARC/RARC denial code | `CO-16` |
| `appeal_status` | Enum | No | None \| In_Review \| Approved \| Rejected | `None` |
| `created_by` | ObjectId | Yes | User who created claim | `60f7b1a2c4d3e8f9a0b1c2d8` |
| `createdAt` | Date | Yes | Creation timestamp | `2026-04-26T09:00:00Z` |
| `updatedAt` | Date | Yes | Last modified timestamp | `2026-04-28T11:20:00Z` |

### 8. Claim Line Items Collection

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `_id` | ObjectId | Yes | Unique line item ID | `60f7b1a2c4d3e8f9a0b1c2dc` |
| `claim_id` | ObjectId | Yes | Parent claim | `60f7b1a2c4d3e8f9a0b1c2db` |
| `line_number` | Number | Yes | Line sequence | `1` |
| `service_date` | Date | Yes | Date of service | `2026-04-25` |
| `procedure_code` | String | Yes | CPT/HCPCS code | `99213` |
| `procedure_description` | String | Yes | Code description | `Office visit, established patient` |
| `modifier` | String | No | Procedure modifier | `25` |
| `units` | Number | Yes | Quantity billed | `1` |
| `unit_charge` | Number | Yes | Charge per unit | `150.00` |
| `total_charge` | Number | Yes | Line total charge | `150.00` |
| `diagnosis_pointer` | String | Yes | Links to diagnosis codes | `A,B` |
| `place_of_service` | String | Yes | POS code for line | `11` |
| `rendering_provider_id` | ObjectId | No | Provider who performed service | `60f7b1a2c4d3e8f9a0b1c2d6` |
| `createdAt` | Date | Yes | Creation timestamp | `2026-04-26T09:00:00Z` |

### 9. Payments & ERA Collection

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `_id` | ObjectId | Yes | Unique payment ID | `60f7b1a2c4d3e8f9a0b1c2dd` |
| `payment_id` | String | Yes | Payment identifier | `PAY-2026-001` |
| `claim_id` | ObjectId | Yes | Associated claim | `60f7b1a2c4d3e8f9a0b1c2db` |
| `payer_id` | ObjectId | Yes | Who made payment | `60f7b1a2c4d3e8f9a0b1c2d4` |
| `patient_id` | ObjectId | Yes | Related patient | `60f7b1a2c4d3e8f9a0b1c2d3` |
| `payment_amount` | Number | Yes | Amount paid | `180.00` |
| `payment_date` | Date | Yes | Date payment received | `2026-05-10` |
| `payment_type` | Enum | Yes | Insurance \| Patient \| Copay \| Deductible \| Adjustment | `Insurance` |
| `payment_method` | Enum | Yes | ERA_EFT \| Check \| Cash \| Credit_Card \| ACH | `ERA_EFT` |
| `check_era_number` | String | No | Check or ERA trace number | `ERA-2026-ABC-001` |
| `applied_amount` | Number | Yes | Amount applied to claim | `180.00` |
| `adjustment_amount` | Number | No | Contractual adjustment | `20.00` |
| `adjustment_reason_code` | String | No | CARC adjustment reason | `CO-45` |
| `patient_responsibility_remaining` | Number | No | Remaining patient balance | `50.00` |
| `status` | Enum | Yes | Pending \| Posted \| Reconciled | `Posted` |
| `notes` | String | No | Payment notes | `Medicare remittance advice` |
| `recorded_by` | ObjectId | Yes | User who posted payment | `60f7b1a2c4d3e8f9a0b1c2d8` |
| `createdAt` | Date | Yes | Creation timestamp | `2026-05-10T10:00:00Z` |

### 10. Denial Management Collection

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `_id` | ObjectId | Yes | Unique denial ID | `60f7b1a2c4d3e8f9a0b1c2de` |
| `denial_id` | String | Yes | Denial record identifier | `DEN-2026-001` |
| `claim_id` | ObjectId | Yes | Denied claim | `60f7b1a2c4d3e8f9a0b1c2db` |
| `patient_id` | ObjectId | Yes | Related patient | `60f7b1a2c4d3e8f9a0b1c2d3` |
| `denial_date` | Date | Yes | Date denial received | `2026-05-05` |
| `denial_reason_code` | String | Yes | CARC/RARC code | `CO-16` |
| `denial_reason_description` | String | Yes | Readable denial reason | `Claim lacks information` |
| `payer_name` | String | Yes | Denying payer | `Medicare` |
| `denied_amount` | Number | Yes | Amount denied | `250.00` |
| `appeal_deadline` | Date | No | Last date to appeal | `2026-06-05` |
| `appeal_status` | Enum | Yes | Not_Appealed \| In_Review \| Appealed \| Won \| Lost | `Not_Appealed` |
| `appeal_notes` | String | No | Appeal documentation | `Submitted corrected claim with NPI` |
| `assigned_to` | ObjectId | No | Staff handling appeal | `60f7b1a2c4d3e8f9a0b1c2d8` |
| `resolution_date` | Date | No | Date resolved | `null` |
| `createdAt` | Date | Yes | Creation timestamp | `2026-05-05T14:20:00Z` |

---

## 🎯 Features Implementation

### 1. Patient Management (`/medical/patients`)

**Features:**
- Create, read, update, deactivate patient records
- Medical record number (MRN) auto-generation
- Demographics and contact information management
- Emergency contact details
- Insurance linkage (primary and secondary)
- Patient search by name, MRN, phone, or DOB
- Patient timeline view (appointments, encounters, claims)
- Duplicate patient detection
- Patient status tracking (Active, Inactive, Deceased)
- Bulk patient import via CSV

**UI Components:**
- `PatientsTable.tsx` - Display all patients with advanced filtering
- `PatientForm.tsx` - Create/edit patient demographics
- `PatientDetail.tsx` - Full patient profile and timeline
- `PatientSearch.tsx` - Quick search with autocomplete
- `PatientInsuranceCard.tsx` - Display linked insurance plans

---

### 2. Provider Management (`/medical/providers`)

**Features:**
- Provider directory management
- NPI number validation and storage
- License tracking with expiration alerts
- Specialty and taxonomy code management
- Provider schedule and availability
- Rendering provider assignment per encounter
- Provider performance analytics (claims, collections)

**UI Components:**
- `ProvidersTable.tsx` - List all providers
- `ProviderForm.tsx` - Add/edit provider details
- `ProviderSchedule.tsx` - Calendar view of availability
- `ProviderPerformance.tsx` - Revenue and claim metrics

---

### 3. Appointment Scheduling (`/medical/appointments`)

**Features:**
- Calendar-based appointment scheduling (day/week/month views)
- Patient self-scheduling portal support
- Provider availability management
- Appointment type configuration (New Patient, Follow-Up, Telehealth)
- Automated appointment reminders (SMS/Email)
- Check-in and check-out workflow
- Waitlist management
- No-show tracking and reporting
- Recurring appointment support

**UI Components:**
- `AppointmentCalendar.tsx` - Full scheduling calendar
- `AppointmentForm.tsx` - Book new appointment
- `AppointmentStatusBadge.tsx` - Visual status indicators
- `CheckInModal.tsx` - Patient check-in interface
- `AppointmentReminders.tsx` - Reminder configuration

---

### 4. Insurance & Eligibility (`/medical/insurance`)

**Features:**
- Payer directory management (commercial, Medicare, Medicaid)
- Electronic payer ID storage for EDI
- Real-time eligibility verification integration (X12 270/271)
- Patient insurance card capture and storage
- Copay, deductible, and out-of-pocket tracking
- Coverage start/end date monitoring
- Insurance expiration alerts
- Secondary and tertiary insurance support

**UI Components:**
- `InsurancePlansTable.tsx` - Manage payer directory
- `EligibilityChecker.tsx` - Real-time verification interface
- `PatientInsuranceForm.tsx` - Link insurance to patient
- `InsuranceCardUploader.tsx` - Scan and store insurance cards
- `EligibilityHistory.tsx` - Verification history per patient

---

### 5. Encounters & Charge Capture (`/medical/encounters`)

**Features:**
- Encounter documentation per visit
- ICD-10-CM diagnosis code entry with search/validation
- CPT/HCPCS procedure code entry with fee schedules
- Modifier application and validation
- Place of service (POS) code selection
- Real-time charge calculation
- Encounter status workflow (Open → Ready for Billing → Billed)
- Multiple diagnosis and procedure linking
- Clinical notes integration

**UI Components:**
- `EncountersTable.tsx` - List all encounters
- `EncounterForm.tsx` - Document visit and capture charges
- `DiagnosisCodeSearch.tsx` - ICD-10 lookup with descriptions
- `ProcedureCodeSearch.tsx` - CPT/HCPCS lookup with fees
- `ChargeSummary.tsx` - Real-time encounter charge preview
- `SuperbillPreview.tsx` - Pre-claim encounter summary

---

### 6. Claims Management (`/medical/claims`)

**Features:**
- Automated claim generation from encounters
- CMS-1500 (professional) and UB-04 (institutional) form support
- Claim scrubbing and validation before submission
- Electronic claim submission (837P/837I via clearinghouse)
- Claim status tracking (Draft → Submitted → Pending → Accepted/Denied)
- Secondary claim auto-generation
- Claim batching and bulk submission
- Clearinghouse integration (Waystar, Change Healthcare, etc.)
- Real-time claim status inquiry (X12 276/277)
- Claim correction and resubmission workflow

**UI Components:**
- `ClaimsTable.tsx` - All claims with status filters
- `ClaimForm.tsx` - Manual claim creation/editing
- `ClaimScrubber.tsx` - Pre-submission validation report
- `ClaimStatusTracker.tsx` - Real-time payer status view
- `CMS1500Preview.tsx` - PDF preview of professional claim
- `ClaimBatchProcessor.tsx` - Bulk submission interface

---

### 7. Payment Posting & ERA (`/medical/payments`)

**Features:**
- Electronic Remittance Advice (ERA) auto-import (835)
- Automated payment posting to claims
- Payment splitting across multiple claims
- Adjustment reason code management (CARC/RARC)
- Patient responsibility tracking (copay, deductible, coinsurance)
- Manual payment entry for checks and cash
- Unapplied payment holding and reconciliation
- Overpayment detection and refund workflow
- Patient statement generation

**UI Components:**
- `PaymentsTable.tsx` - All payments and ERAs
- `ERAParser.tsx` - Import and parse 835 files
- `PaymentPostingForm.tsx` - Apply payments to claims
- `PatientStatementGenerator.tsx` - Create patient bills
- `UnappliedPayments.tsx` - Manage unallocated funds
- `RefundProcessor.tsx` - Handle overpayment refunds

---

### 8. Denial Management (`/medical/denials`)

**Features:**
- Automatic denial capture from ERAs and claim status
- Denial categorization by reason code (CARC/RARC)
- Appeal deadline tracking and alerts
- Appeal letter generation and submission tracking
- Denial trend analysis by payer, provider, and code
- Root cause analysis dashboard
- Work queue for denied claims
- Automated appeal workflow

**UI Components:**
- `DenialsTable.tsx` - All denied claims
- `DenialDetail.tsx` - Deep dive into denial reason
- `AppealForm.tsx` - Create and track appeals
- `DenialAnalytics.tsx` - Trends and root causes
- `DenialWorkQueue.tsx` - Staff task list for appeals
- `AppealLetterTemplate.tsx` - Generate appeal letters

---

### 9. Medical Reports & Analytics (`/medical/reports`)

**Features:**
- Revenue cycle dashboard (charges, payments, adjustments, AR)
- Accounts receivable aging report (0-30, 31-60, 61-90, 90+ days)
- Payer mix analysis
- Claim acceptance and denial rates
- Provider productivity and collections
- Patient balance summary
- Daily/monthly production reports
- Custom date range filtering
- Export reports (PDF, Excel, CSV)
- Key Metrics:
  - Days in Accounts Receivable
  - Clean Claim Rate
  - First Pass Resolution Rate
  - Denial Rate
  - Collection Rate
  - Average Reimbursement per Encounter

**Report Types:**
- Revenue Cycle Summary
- AR Aging by Payer and Patient
- Claim Status Summary
- Denial Analysis by Reason
- Provider Production Report
- Patient Balance Report
- Insurance Collection Report
- Monthly Financial Dashboard

**UI Components:**
- `MedicalReportsDashboard.tsx` - Executive overview
- `ARAgingReport.tsx` - Aging buckets visualization
- `RevenueCycleMetrics.tsx` - KPI cards and charts
- `PayerMixReport.tsx` - Payer distribution analysis
- `ProviderProductionReport.tsx` - Per-provider metrics
- `ClaimMetricsDashboard.tsx` - Acceptance/denial trends

---

## 📁 File Structure to Create

```
/app/(dashboard)/medical/
├── page.tsx                           (Medical home / dashboard)
├── layout.tsx                         (Layout with medical navigation)
├── patients/
│   ├── page.tsx                       (Patients list)
│   ├── create/
│   │   └── page.tsx                   (New patient registration)
│   └── [id]/
│       └── page.tsx                   (Patient detail / timeline)
├── providers/
│   ├── page.tsx                       (Providers directory)
│   ├── create/
│   │   └── page.tsx                   (Add provider)
│   └── [id]/
│       └── page.tsx                   (Provider detail)
├── appointments/
│   ├── page.tsx                       (Scheduling calendar)
│   ├── create/
│   │   └── page.tsx                   (Book appointment)
│   └── [id]/
│       └── page.tsx                   (Appointment detail)
├── insurance/
│   ├── page.tsx                       (Insurance plans directory)
│   ├── eligibility/
│   │   └── page.tsx                   (Eligibility verification)
│   └── [id]/
│       └── page.tsx                   (Plan detail)
├── encounters/
│   ├── page.tsx                       (Encounters list)
│   ├── create/
│   │   └── page.tsx                   (New encounter / charge capture)
│   └── [id]/
│       └── page.tsx                   (Encounter detail)
├── claims/
│   ├── page.tsx                       (Claims list)
│   ├── create/
│   │   └── page.tsx                   (Generate claim)
│   ├── scrub/
│   │   └── page.tsx                   (Claim scrubbing)
│   └── [id]/
│       └── page.tsx                   (Claim detail)
├── payments/
│   ├── page.tsx                       (Payments & ERAs)
│   ├── post/
│   │   └── page.tsx                   (Payment posting)
│   └── era/
│       └── page.tsx                   (ERA import)
├── denials/
│   ├── page.tsx                       (Denials list)
│   ├── appeals/
│   │   └── page.tsx                   (Appeal management)
│   └── [id]/
│       └── page.tsx                   (Denial detail)
└── reports/
    ├── page.tsx                       (Reports dashboard)
    ├── ar-aging/
    │   └── page.tsx                   (AR aging report)
    ├── revenue-cycle/
    │   └── page.tsx                   (Revenue cycle metrics)
    └── provider-production/
        └── page.tsx                   (Provider production)

/components/ui/medical/
├── PatientsTable.tsx
├── PatientForm.tsx
├── PatientDetail.tsx
├── PatientSearch.tsx
├── PatientInsuranceCard.tsx
├── ProvidersTable.tsx
├── ProviderForm.tsx
├── ProviderSchedule.tsx
├── ProviderPerformance.tsx
├── AppointmentCalendar.tsx
├── AppointmentForm.tsx
├── AppointmentStatusBadge.tsx
├── CheckInModal.tsx
├── InsurancePlansTable.tsx
├── EligibilityChecker.tsx
├── PatientInsuranceForm.tsx
├── EncountersTable.tsx
├── EncounterForm.tsx
├── DiagnosisCodeSearch.tsx
├── ProcedureCodeSearch.tsx
├── ChargeSummary.tsx
├── SuperbillPreview.tsx
├── ClaimsTable.tsx
├── ClaimForm.tsx
├── ClaimScrubber.tsx
├── ClaimStatusTracker.tsx
├── CMS1500Preview.tsx
├── ClaimBatchProcessor.tsx
├── PaymentsTable.tsx
├── ERAParser.tsx
├── PaymentPostingForm.tsx
├── PatientStatementGenerator.tsx
├── DenialsTable.tsx
├── DenialDetail.tsx
├── AppealForm.tsx
├── DenialAnalytics.tsx
├── DenialWorkQueue.tsx
├── MedicalReportsDashboard.tsx
├── ARAgingReport.tsx
├── RevenueCycleMetrics.tsx
├── PayerMixReport.tsx
├── ProviderProductionReport.tsx
└── ClaimMetricsDashboard.tsx

/src/services/medical/
├── patientService.ts
├── providerService.ts
├── appointmentService.ts
├── insuranceService.ts
├── eligibilityService.ts
├── encounterService.ts
├── diagnosisCodeService.ts
├── procedureCodeService.ts
├── claimService.ts
├── claimScrubberService.ts
├── paymentService.ts
├── eraService.ts
├── denialService.ts
├── appealService.ts
└── reportService.ts
```

---

## 🔌 API Endpoints

```
# Patients
POST   /api/medical/patients                 (Create)
GET    /api/medical/patients                 (List all)
GET    /api/medical/patients/:id             (Get one)
PUT    /api/medical/patients/:id             (Update)
DELETE /api/medical/patients/:id             (Deactivate)
GET    /api/medical/patients/:id/timeline    (Patient history)
POST   /api/medical/patients/import          (Bulk import)

# Providers
POST   /api/medical/providers                (Create)
GET    /api/medical/providers                (List all)
GET    /api/medical/providers/:id            (Get one)
PUT    /api/medical/providers/:id            (Update)
GET    /api/medical/providers/:id/schedule   (Get schedule)
GET    /api/medical/providers/:id/performance (Production metrics)

# Appointments
POST   /api/medical/appointments             (Create)
GET    /api/medical/appointments             (List all / calendar)
GET    /api/medical/appointments/:id         (Get one)
PUT    /api/medical/appointments/:id         (Update)
DELETE /api/medical/appointments/:id         (Cancel)
POST   /api/medical/appointments/:id/checkin (Check-in)
POST   /api/medical/appointments/:id/checkout (Check-out)
POST   /api/medical/appointments/reminders   (Send reminders)

# Insurance & Eligibility
POST   /api/medical/insurance                (Create payer)
GET    /api/medical/insurance                (List payers)
GET    /api/medical/insurance/:id            (Get payer)
PUT    /api/medical/insurance/:id            (Update payer)
POST   /api/medical/eligibility/check        (Real-time eligibility)
GET    /api/medical/eligibility/:patientId   (Patient eligibility history)

# Encounters
POST   /api/medical/encounters               (Create)
GET    /api/medical/encounters               (List all)
GET    /api/medical/encounters/:id           (Get one)
PUT    /api/medical/encounters/:id           (Update)
POST   /api/medical/encounters/:id/ready     (Mark ready for billing)
GET    /api/medical/diagnosis-codes          (ICD-10 search)
GET    /api/medical/procedure-codes          (CPT/HCPCS search)

# Claims
POST   /api/medical/claims                   (Create from encounter)
GET    /api/medical/claims                   (List all)
GET    /api/medical/claims/:id               (Get one)
PUT    /api/medical/claims/:id               (Update)
POST   /api/medical/claims/:id/scrub         (Scrub claim)
POST   /api/medical/claims/:id/submit        (Submit to clearinghouse)
POST   /api/medical/claims/:id/resubmit      (Resubmit corrected)
GET    /api/medical/claims/:id/status        (Check payer status)
POST   /api/medical/claims/batch-submit      (Batch submission)

# Payments & ERA
POST   /api/medical/payments                 (Record payment)
GET    /api/medical/payments                 (List all)
POST   /api/medical/era/import               (Import ERA 835)
POST   /api/medical/era/:id/parse            (Parse ERA file)
POST   /api/medical/payments/:id/apply       (Apply to claim)
GET    /api/medical/payments/unapplied       (Unapplied payments)
POST   /api/medical/statements/generate      (Generate patient statement)

# Denials & Appeals
GET    /api/medical/denials                  (List denials)
GET    /api/medical/denials/:id              (Get denial)
POST   /api/medical/denials/:id/appeal       (File appeal)
PUT    /api/medical/appeals/:id              (Update appeal)
GET    /api/medical/denials/analytics        (Denial trends)
GET    /api/medical/denials/work-queue       (Staff work queue)

# Reports
GET    /api/medical/reports/revenue-cycle    (Revenue cycle summary)
GET    /api/medical/reports/ar-aging         (AR aging)
GET    /api/medical/reports/payer-mix        (Payer mix analysis)
GET    /api/medical/reports/provider-production (Provider metrics)
GET    /api/medical/reports/claim-metrics    (Claim acceptance/denial)
GET    /api/medical/reports/export           (Export report)
```

---

## ✅ Implementation Checklist

- [ ] Database schema creation (patients, providers, appointments, insurance, encounters, claims, payments, denials)
- [ ] Service layer implementation (patientService, encounterService, claimService, paymentService)
- [ ] UI components creation (Tables, Forms, Calendar, Code Search)
- [ ] Patient registration and management complete
- [ ] Provider directory and scheduling complete
- [ ] Appointment scheduling with reminders
- [ ] Insurance eligibility verification integration
- [ ] Encounter documentation and charge capture
- [ ] ICD-10 and CPT/HCPCS code search integration
- [ ] Claims generation and CMS-1500 preview
- [ ] Claim scrubbing and validation engine
- [ ] Electronic claim submission (clearinghouse integration)
- [ ] ERA 835 auto-import and payment posting
- [ ] Denial management and appeal workflow
- [ ] Patient statement generation
- [ ] Revenue cycle analytics and reporting
- [ ] AR aging and payer mix reports
- [ ] Provider production dashboards
- [ ] Role-based access (Billers, Coders, Providers, Admin)
- [ ] HIPAA audit logging
- [ ] User testing
- [ ] Documentation complete
- [ ] Production deployment

---

## 🔌 External Integrations Required

- **Clearinghouse**: Waystar, Change Healthcare, Availity, or Office Ally for 837P/837I claim submission and 835 ERA retrieval
- **Eligibility Verification**: X12 270/271 transaction support via clearinghouse or payer direct
- **Claim Status Inquiry**: X12 276/277 transaction support
- **NPI Registry**: NPPES NPI validation API
- **ICD-10 Database**: CMS or third-party ICD-10-CM lookup API
- **CPT Codes**: AMA CPT database or third-party procedure code API
- **Payment Processing**: Stripe or Square for patient credit card payments
- **SMS/Email**: Twilio / SendGrid for appointment reminders and patient statements
- **Document Storage**: AWS S3 or Azure Blob for insurance cards, ERA files, and appeal letters

---

## 🔐 Security & Compliance

- **HIPAA Compliance**: Full adherence to HIPAA Privacy and Security Rules
- **PHI Encryption**: All Protected Health Information encrypted at rest (AES-256) and in transit (TLS 1.3)
- **Role-Based Access Control**:
  - **Practice Admin**: Full access
  - **Biller**: Claims, payments, denials, reports
  - **Coder**: Encounters, diagnosis/procedure codes
  - **Provider**: Patient view, encounter documentation, schedule
  - **Front Desk**: Patient registration, appointments, eligibility checks
- **Audit Logging**: Comprehensive audit trail for all PHI access and modifications
- **Session Timeout**: Automatic logout after period of inactivity
- **Minimum Necessary**: Users only access PHI necessary for their role
- **Business Associate Agreements (BAAs)**: Required with all third-party vendors handling PHI
- **Data Backup**: Encrypted, immutable backups with defined retention
- **User Authentication**: Multi-factor authentication (MFA) support

---

## 📝 Implementation Notes

**Status**: PENDING - Ready for development
**Priority**: High
**Estimated Timeline**: 12-16 weeks
**Team Required**:
- Backend Developers (APIs, EDI integrations)
- Frontend Developers (Healthcare UI/UX)
- Database Administrator
- Healthcare Compliance Officer (HIPAA)
- EDI / Clearinghouse Integration Specialist
- QA Engineers

**Phased Approach**:
- **Phase 1** (Weeks 1-4): Patient management, Provider directory, Appointment scheduling
- **Phase 2** (Weeks 5-7): Insurance management, Eligibility verification, Encounter documentation
- **Phase 3** (Weeks 8-11): Medical coding (ICD/CPT), Claims generation, Claim scrubbing, Submission
- **Phase 4** (Weeks 12-14): ERA import, Payment posting, Denial management, Appeals
- **Phase 5** (Weeks 15-16): Reporting & analytics, HIPAA compliance review, Testing, Deployment

---

## 🎯 Key Features Highlights

✨ **Patient Management**: Centralized medical records with demographics, insurance, and visit history
✨ **Appointment Scheduling**: Calendar-based booking with automated reminders and check-in workflow
✨ **Insurance Eligibility**: Real-time verification of patient benefits before service
✨ **Charge Capture**: ICD-10 diagnosis and CPT procedure coding with real-time charge calculation
✨ **Claims Management**: Automated CMS-1500 generation, scrubbing, and electronic submission
✨ **Payment Posting**: ERA 835 auto-import with automated claim matching and adjustment posting
✨ **Denial Management**: Tracking, categorization, and appeal workflow for rejected claims
✨ **Revenue Analytics**: AR aging, payer mix, denial trends, and provider production dashboards

