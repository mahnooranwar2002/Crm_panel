# CRM New Modules - Planning Document

## 📋 Overview
This document outlines the structure for implementing 5 new major modules in the existing CRM system. Each module will follow the established architectural pattern used in Companies, Leads, Opportunities, Users, and Roles management.

---

## 🏗️ Current CRM Architecture Pattern

### Established Components & Services:
- **UI Components**: Tables with CRUD (Create, Read, Update, Delete) functionality
- **Services**: API integration layer for data operations
- **State Management**: React hooks (useState, useEffect) with toast notifications
- **Features**: Search, pagination, filtering, modals for add/edit, detail views
- **Icons**: React-icons for visual consistency
- **Styling**: Tailwind CSS with custom color schemes

### Core Tables Currently:
1. **Companies** - Business entities
2. **Leads** - Potential customers
3. **Opportunities** - Sales prospects with probability & amount
4. **Users** - Team members with roles
5. **Roles** - Permission management

---

## 🚀 NEW MODULES IMPLEMENTATION PLAN

---

## 1. PROJECT MANAGEMENT

### Purpose:
Track all projects, tasks, timelines, resources, and project health across the organization.

### Main Table Fields:

#### **Projects Table**
| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `_id` | ObjectId | Unique identifier | Auto | 507f1f77... |
| `project_name` | String | Project title | Yes | Website Redesign |
| `description` | String | Project details | No | Redesign company homepage |
| `client_id` / `company_id` | String | Associated company | Yes | 507f1f77... |
| `owner_id` | String | Project manager | Yes | 507f1f77... |
| `team_members` | Array[String] | User IDs assigned | No | [507f1f77..., 507f1f77...] |
| `start_date` | Date | Project start | Yes | 2026-04-22 |
| `end_date` | Date | Expected completion | Yes | 2026-06-30 |
| `status` | String | Enum: Active, On_Hold, Completed, Cancelled | Yes | Active |
| `budget` | Number | Allocated budget | No | 50000 |
| `spent_amount` | Number | Amount spent so far | Auto | 15000 |
| `progress_percentage` | Number | 0-100 completion % | Auto | 45 |
| `priority` | String | Enum: Low, Medium, High, Critical | Yes | High |
| `category` | String | Type: Development, Design, Marketing, Other | Yes | Development |
| `createdAt` | Date | Creation timestamp | Auto | 2026-04-01 |
| `updatedAt` | Date | Last modified | Auto | 2026-04-22 |

#### **Project Tasks Sub-Table** (Nested in Projects)
| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `task_id` | String | Unique task ID | Auto |
| `task_name` | String | Task title | Yes |
| `assigned_to` | String | User ID | Yes |
| `priority` | String | Enum: Low, Medium, High | Yes |
| `status` | String | Enum: To_Do, In_Progress, Review, Done | Yes |
| `due_date` | Date | Task deadline | Yes |
| `hours_estimated` | Number | Estimated hours | No |
| `hours_spent` | Number | Actual hours | No |

---

## 2. FINANCIAL MANAGEMENT

### Purpose:
Manage invoices, expenses, payments, budgets, and financial reports.

### Main Table Fields:

#### **Invoices Table**
| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `_id` | ObjectId | Unique identifier | Auto | 507f1f77... |
| `invoice_number` | String | Invoice ID | Yes | INV-2026-001 |
| `client_id` / `company_id` | String | Associated company | Yes | 507f1f77... |
| `amount` | Number | Total invoice amount | Yes | 5000 |
| `currency` | String | Currency code | Yes | USD |
| `issue_date` | Date | Invoice issue date | Yes | 2026-04-20 |
| `due_date` | Date | Payment due date | Yes | 2026-05-20 |
| `status` | String | Enum: Draft, Sent, Viewed, Paid, Overdue, Cancelled | Yes | Sent |
| `description` | String | Invoice description | No | Project completion - Phase 1 |
| `items` | Array | Line items (array of {description, quantity, rate, amount}) | Yes | [...] |
| `tax_percentage` | Number | Tax % applied | No | 10 |
| `discount_percentage` | Number | Discount % applied | No | 5 |
| `payment_method` | String | Enum: Bank_Transfer, Credit_Card, Cash, Cheque | No | Bank_Transfer |
| `notes` | String | Additional notes | No | Net 30 terms |
| `created_by` | String | User ID | Auto | 507f1f77... |
| `createdAt` | Date | Creation timestamp | Auto | 2026-04-20 |
| `updatedAt` | Date | Last modified | Auto | 2026-04-22 |

#### **Expenses Table**
| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `_id` | ObjectId | Unique identifier | Auto | 507f1f77... |
| `expense_name` | String | Expense description | Yes | Office Supplies |
| `category` | String | Enum: Travel, Equipment, Office, Utilities, Other | Yes | Office |
| `amount` | Number | Expense amount | Yes | 250 |
| `currency` | String | Currency code | Yes | USD |
| `expense_date` | Date | When expense occurred | Yes | 2026-04-15 |
| `submitted_by` | String | User ID | Yes | 507f1f77... |
| `approved_by` | String | Approver user ID | No | 507f1f77... |
| `status` | String | Enum: Submitted, Approved, Rejected, Reimbursed | Yes | Submitted |
| `receipt_url` | String | URL to receipt file | No | https://... |
| `notes` | String | Additional details | No | Quarterly office supplies |
| `createdAt` | Date | Creation timestamp | Auto | 2026-04-15 |
| `updatedAt` | Date | Last modified | Auto | 2026-04-22 |

#### **Payments Table**
| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `_id` | ObjectId | Unique identifier | Auto | 507f1f77... |
| `invoice_id` | String | Associated invoice | Yes | 507f1f77... |
| `amount_received` | Number | Payment amount | Yes | 5000 |
| `payment_date` | Date | When payment received | Yes | 2026-04-22 |
| `payment_method` | String | Enum: Bank_Transfer, Cheque, Credit_Card, Cash | Yes | Bank_Transfer |
| `reference_number` | String | Transaction reference | No | TXN-12345-ABC |
| `notes` | String | Payment notes | No | Received via wire transfer |
| `recorded_by` | String | User ID who recorded | Auto | 507f1f77... |
| `createdAt` | Date | Creation timestamp | Auto | 2026-04-22 |

---

## 3. SOFTWARE DEVELOPMENT MANAGEMENT

### Purpose:
Track features, bugs, code repositories, releases, and development workflows.

### Main Table Fields:

#### **Features/Issues Table**
| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `_id` | ObjectId | Unique identifier | Auto | 507f1f77... |
| `ticket_id` | String | Issue ID | Yes | DEV-001 |
| `title` | String | Feature/bug title | Yes | Login form validation |
| `description` | String | Detailed description | Yes | Add email validation to login |
| `type` | String | Enum: Feature, Bug, Enhancement, Task, Hotfix | Yes | Feature |
| `priority` | String | Enum: Low, Medium, High, Critical | Yes | High |
| `severity` | String | (For bugs) Enum: Minor, Major, Critical | No | Major |
| `status` | String | Enum: Backlog, TODO, In_Progress, Review, Testing, Done | Yes | In_Progress |
| `assigned_to` | String | Developer user ID | Yes | 507f1f77... |
| `project_id` | String | Associated project | Yes | 507f1f77... |
| `repository` | String | Git repo name | No | crm-frontend |
| `branch_name` | String | Feature branch | No | feature/login-validation |
| `estimated_hours` | Number | Time estimate | No | 8 |
| `actual_hours` | Number | Actual time spent | No | 6 |
| `start_date` | Date | Work start date | No | 2026-04-20 |
| `due_date` | Date | Target completion | Yes | 2026-04-25 |
| `tags` | Array[String] | Labels/tags | No | [backend, authentication] |
| `linked_issues` | Array[String] | Related issue IDs | No | [DEV-002, DEV-003] |
| `createdAt` | Date | Creation timestamp | Auto | 2026-04-20 |
| `updatedAt` | Date | Last modified | Auto | 2026-04-22 |

#### **Code Reviews Table**
| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `_id` | ObjectId | Unique identifier | Auto | 507f1f77... |
| `pull_request_id` | String | PR/MR ID | Yes | PR-101 |
| `title` | String | PR title | Yes | Add email validation |
| `issue_id` | String | Related issue | No | DEV-001 |
| `submitted_by` | String | Developer user ID | Yes | 507f1f77... |
| `reviewed_by` | String | Reviewer user ID | Yes | 507f1f77... |
| `status` | String | Enum: Draft, Pending, Approved, Changes_Required, Rejected | Yes | Pending |
| `branch_from` | String | Source branch | Yes | feature/login-validation |
| `branch_to` | String | Target branch | Yes | develop |
| `files_changed` | Number | Number of files | No | 5 |
| `lines_added` | Number | Lines added | No | 150 |
| `lines_deleted` | Number | Lines removed | No | 45 |
| `comments_count` | Number | Review comments | No | 3 |
| `created_date` | Date | PR creation date | Yes | 2026-04-22 |
| `updated_date` | Date | Last update | No | 2026-04-22 |

#### **Releases Table**
| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `_id` | ObjectId | Unique identifier | Auto | 507f1f77... |
| `version` | String | Release version | Yes | 1.2.0 |
| `release_date` | Date | Release date | Yes | 2026-05-01 |
| `description` | String | Release notes | Yes | Bug fixes and improvements |
| `status` | String | Enum: Planning, In_Development, Testing, Released, Archived | Yes | Released |
| `project_id` | String | Associated project | Yes | 507f1f77... |
| `features_included` | Array[String] | Feature/issue IDs | No | [DEV-001, DEV-002] |
| `bugs_fixed` | Number | Number of bugs fixed | No | 5 |
| `release_notes_url` | String | Documentation link | No | https://... |
| `released_by` | String | User ID who released | No | 507f1f77... |

---

## 4. REAL ESTATE AND CONSTRUCTION MANAGEMENT

### Purpose:
Manage properties, projects, inspections, contractors, and construction timelines.

### Main Table Fields:

#### **Properties Table**
| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `_id` | ObjectId | Unique identifier | Auto | 507f1f77... |
| `property_id` | String | Property code | Yes | PROP-2026-001 |
| `property_name` | String | Property title | Yes | Downtown Office Complex |
| `property_type` | String | Enum: Commercial, Residential, Industrial, Mixed | Yes | Commercial |
| `address` | String | Full address | Yes | 123 Main St, City, State |
| `city` | String | City | Yes | New York |
| `state` | String | State/Province | Yes | NY |
| `postal_code` | String | ZIP code | No | 10001 |
| `country` | String | Country | Yes | USA |
| `latitude` | Number | GPS latitude | No | 40.7128 |
| `longitude` | Number | GPS longitude | No | -74.0060 |
| `land_area_sqft` | Number | Land size | No | 50000 |
| `built_area_sqft` | Number | Built area | No | 35000 |
| `owner_id` / `client_id` | String | Property owner | Yes | 507f1f77... |
| `purchase_price` | Number | Purchase cost | No | 5000000 |
| `current_value` | Number | Current valuation | No | 5500000 |
| `status` | String | Enum: Available, Occupied, Under_Construction, Sold, Leased | Yes | Under_Construction |
| `total_units` | Number | Total units (if multi-unit) | No | 20 |
| `occupied_units` | Number | Currently occupied | No | 15 |
| `description` | String | Property details | No | Modern office tower |
| `images_url` | Array[String] | Property photos | No | [https://..., https://...] |
| `createdAt` | Date | Creation timestamp | Auto | 2026-04-20 |
| `updatedAt` | Date | Last modified | Auto | 2026-04-22 |

#### **Construction Projects Table**
| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `_id` | ObjectId | Unique identifier | Auto | 507f1f77... |
| `project_id` | String | Project code | Yes | CONST-2026-001 |
| `property_id` | String | Associated property | Yes | 507f1f77... |
| `project_name` | String | Construction project name | Yes | Office Building Phase 1 |
| `description` | String | Project details | No | New construction of 20-story tower |
| `contractor_id` | String | Main contractor | Yes | 507f1f77... |
| `project_manager_id` | String | Project manager | Yes | 507f1f77... |
| `start_date` | Date | Construction start | Yes | 2026-05-01 |
| `planned_end_date` | Date | Planned completion | Yes | 2027-06-30 |
| `actual_end_date` | Date | Actual completion | No | - |
| `budget` | Number | Total project budget | Yes | 2000000 |
| `spent_amount` | Number | Amount spent | Auto | 450000 |
| `status` | String | Enum: Planning, In_Progress, On_Hold, Completed, Cancelled | Yes | In_Progress |
| `progress_percentage` | Number | 0-100 completion % | Auto | 35 |
| `priority` | String | Enum: Low, Medium, High, Critical | Yes | High |
| `scope_of_work` | String | Detailed scope | No | Concrete, steel, electrical work |
| `safety_incidents` | Number | Reported incidents | No | 0 |
| `createdAt` | Date | Creation timestamp | Auto | 2026-04-20 |

#### **Inspections Table**
| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `_id` | ObjectId | Unique identifier | Auto | 507f1f77... |
| `inspection_id` | String | Inspection code | Yes | INSP-2026-001 |
| `property_id` | String | Property inspected | Yes | 507f1f77... |
| `project_id` | String | Construction project | Yes | 507f1f77... |
| `inspection_type` | String | Enum: Safety, Structural, Electrical, Plumbing, Final, Other | Yes | Structural |
| `inspection_date` | Date | Inspection date | Yes | 2026-04-20 |
| `inspector_id` | String | Inspector user ID | Yes | 507f1f77... |
| `status` | String | Enum: Passed, Failed, Conditional | Yes | Passed |
| `notes` | String | Inspection findings | Yes | All structural elements met specs |
| `issues_found` | Number | Number of defects | No | 0 |
| `issues_resolved` | Number | Number fixed | No | 0 |
| `photos_url` | Array[String] | Inspection photos | No | [https://..., https://...] |
| `next_inspection_date` | Date | Follow-up scheduled | No | 2026-05-01 |
| `report_url` | String | Inspection report | No | https://... |
| `createdAt` | Date | Creation timestamp | Auto | 2026-04-20 |

#### **Contractors Table**
| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `_id` | ObjectId | Unique identifier | Auto | 507f1f77... |
| `contractor_name` | String | Company name | Yes | ABC Construction Co. |
| `contractor_type` | String | Enum: General, Subcontractor, Supplier | Yes | General |
| `email` | String | Contact email | Yes | contact@abc.com |
| `phone` | String | Contact phone | Yes | 555-0123 |
| `address` | String | Office address | Yes | 456 Oak Ave, City |
| `license_number` | String | License ID | No | LIC-123456 |
| `license_expiry` | Date | License expiration | No | 2027-12-31 |
| `specialization` | Array[String] | Areas of expertise | No | [Concrete, Steel] |
| `rating` | Number | Rating 1-5 | No | 4.5 |
| `total_projects` | Number | Projects completed | No | 25 |
| `status` | String | Enum: Active, Inactive, Blocked | Yes | Active |
| `bank_details` | Object | Banking info | No | {...} |
| `createdAt` | Date | Creation timestamp | Auto | 2026-04-20 |

---

## 5. MARKETING AUTOMATION

### Purpose:
Manage campaigns, email sequences, leads scoring, and marketing analytics.

### Main Table Fields:

#### **Marketing Campaigns Table**
| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `_id` | ObjectId | Unique identifier | Auto | 507f1f77... |
| `campaign_id` | String | Campaign code | Yes | CAMP-2026-001 |
| `campaign_name` | String | Campaign title | Yes | Spring Product Launch |
| `description` | String | Campaign details | No | Launch of new product line |
| `campaign_type` | String | Enum: Email, Social, Webinar, Event, Content, Ads | Yes | Email |
| `status` | String | Enum: Draft, Scheduled, Active, Paused, Completed, Archived | Yes | Active |
| `owner_id` | String | Campaign manager user ID | Yes | 507f1f77... |
| `start_date` | Date | Campaign launch | Yes | 2026-04-22 |
| `end_date` | Date | Campaign end | Yes | 2026-05-22 |
| `target_audience_id` | String | Segment ID | No | 507f1f77... |
| `total_contacts` | Number | Number of contacts | No | 5000 |
| `budget` | Number | Campaign budget | No | 10000 |
| `spent_amount` | Number | Amount spent | Auto | 3500 |
| `channels` | Array[String] | Channels: [Email, SMS, Social, Push] | No | [Email, Social] |
| `goal` | String | Campaign objective | No | Increase brand awareness |
| `kpi_target` | String | Target KPI | No | 5000 clicks, 2% conversion |
| `createdAt` | Date | Creation timestamp | Auto | 2026-04-22 |
| `updatedAt` | Date | Last modified | Auto | 2026-04-22 |

#### **Email Sequences Table**
| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `_id` | ObjectId | Unique identifier | Auto | 507f1f77... |
| `sequence_id` | String | Sequence code | Yes | SEQ-2026-001 |
| `sequence_name` | String | Sequence title | Yes | Welcome Series |
| `campaign_id` | String | Associated campaign | Yes | 507f1f77... |
| `description` | String | Sequence details | No | Automated welcome emails |
| `status` | String | Enum: Draft, Active, Paused, Completed | Yes | Active |
| `created_by` | String | User ID | Yes | 507f1f77... |
| `emails` | Array | Email templates in sequence | Yes | [{email_id, send_delay_hours, ...}] |
| `trigger_event` | String | Enum: Lead_Created, Lead_Score_Above, Date_Based, Manual | Yes | Lead_Created |
| `trigger_value` | Number | Trigger condition value | No | 50 |
| `total_sent` | Number | Total emails sent | Auto | 1200 |
| `open_rate` | Number | Email open % | Auto | 25.5 |
| `click_rate` | Number | Click rate % | Auto | 8.3 |
| `conversion_rate` | Number | Conversion % | Auto | 2.1 |
| `createdAt` | Date | Creation timestamp | Auto | 2026-04-22 |

#### **Lead Scoring Rules Table**
| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `_id` | ObjectId | Unique identifier | Auto | 507f1f77... |
| `rule_id` | String | Rule code | Yes | SCORE-001 |
| `rule_name` | String | Rule description | Yes | Enterprise Company Size |
| `attribute` | String | Lead attribute | Yes | company_size |
| `operator` | String | Enum: equals, greater_than, less_than, contains, in | Yes | equals |
| `value` | Mixed | Comparison value | Yes | enterprise |
| `points` | Number | Points to award | Yes | 25 |
| `status` | String | Enum: Active, Inactive | Yes | Active |
| `created_by` | String | User ID | Yes | 507f1f77... |
| `createdAt` | Date | Creation timestamp | Auto | 2026-04-22 |

#### **Lead Scoring Results Table** (Auto-generated)
| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `_id` | ObjectId | Unique identifier | Auto | 507f1f77... |
| `lead_id` | String | Associated lead | Yes | 507f1f77... |
| `total_score` | Number | Cumulative score | Auto | 125 |
| `score_grade` | String | Grade: A, B, C, D | Auto | A |
| `scoring_breakdown` | Array | Rules applied | Auto | [{rule_id, points, ...}] |
| `last_updated` | Date | Last recalculation | Auto | 2026-04-22 |

#### **Email Templates Table**
| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `_id` | ObjectId | Unique identifier | Auto | 507f1f77... |
| `template_id` | String | Template code | Yes | TMPL-2026-001 |
| `template_name` | String | Template title | Yes | Welcome Email |
| `subject` | String | Email subject | Yes | Welcome to {{company_name}}! |
| `body_html` | String | HTML content | Yes | <html>...</html> |
| `category` | String | Enum: Welcome, Follow-up, Promotional, Transactional, Newsletter | Yes | Welcome |
| `variables` | Array[String] | Template variables | No | [company_name, lead_name, offer] |
| `status` | String | Enum: Draft, Active, Archived | Yes | Active |
| `created_by` | String | User ID | Yes | 507f1f77... |
| `createdAt` | Date | Creation timestamp | Auto | 2026-04-22 |

#### **Analytics Metrics Table** (Auto-aggregated)
| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `_id` | ObjectId | Unique identifier | Auto | 507f1f77... |
| `campaign_id` | String | Campaign reference | Yes | 507f1f77... |
| `metric_date` | Date | Metric date | Yes | 2026-04-22 |
| `impressions` | Number | Total impressions | Auto | 50000 |
| `clicks` | Number | Total clicks | Auto | 1500 |
| `conversions` | Number | Total conversions | Auto | 30 |
| `leads_generated` | Number | Leads created | Auto | 45 |
| `ctr` | Number | Click-through rate % | Auto | 3.0 |
| `conversion_rate` | Number | Conversion rate % | Auto | 2.0 |
| `cost_per_lead` | Number | CPL | Auto | 77.78 |
| `roi` | Number | Return on investment % | Auto | 150 |

---

## 📁 Implementation Roadmap

### Phase 1: Project Management (Week 1-2)
- [ ] Create ProjectsTable component
- [ ] Create ProjectTasksTable component  
- [ ] Implement ProjectService API integration
- [ ] Dashboard view for project overview
- [ ] Gantt chart visualization (optional)

### Phase 2: Financial Management (Week 2-3)
- [ ] Create InvoicesTable component
- [ ] Create ExpensesTable component
- [ ] Create PaymentsTable component
- [ ] Implement FinancialService API integration
- [ ] Financial dashboard with KPIs

### Phase 3: Software Development Management (Week 3-4)
- [ ] Create IssuesTable component
- [ ] Create CodeReviewsTable component
- [ ] Create ReleasesTable component
- [ ] Implement DevService API integration
- [ ] Release calendar view

### Phase 4: Real Estate & Construction (Week 4-5)
- [ ] Create PropertiesTable component
- [ ] Create ConstructionProjectsTable component
- [ ] Create InspectionsTable component
- [ ] Create ContractorsTable component
- [ ] Implement RealEstateService API integration
- [ ] Property map view with geolocation

### Phase 5: Marketing Automation (Week 5-6)
- [ ] Create CampaignsTable component
- [ ] Create EmailSequencesTable component
- [ ] Create LeadScoringRulesTable component
- [ ] Create EmailTemplatesTable component
- [ ] Implement MarketingService API integration
- [ ] Campaign analytics dashboard

---

## 🔄 Service Layer Structure

Each module will have a corresponding service file:

```
src/services/
├── projectService.ts          // Project Management
├── financialService.ts        // Financial Management
├── developmentService.ts      // Software Development
├── realEstateService.ts       // Real Estate & Construction
└── marketingService.ts        // Marketing Automation
```

### Service Methods Pattern:
```typescript
export class [ModuleService] {
  static async get[Items](page, limit, search?) { }
  static async get[Item](id) { }
  static async create[Item](data) { }
  static async update[Item](id, data) { }
  static async delete[Item](id) { }
}
```

---

## 🎨 UI Components Pattern

Each module table will follow the established pattern:

```
components/ui/
├── ProjectsTable.tsx
├── ProjectTasksTable.tsx
├── InvoicesTable.tsx
├── ExpensesTable.tsx
├── PaymentsTable.tsx
├── IssuesTable.tsx
├── CodeReviewsTable.tsx
├── ReleasesTable.tsx
├── PropertiesTable.tsx
├── ConstructionProjectsTable.tsx
├── InspectionsTable.tsx
├── ContractorsTable.tsx
├── CampaignsTable.tsx
├── EmailSequencesTable.tsx
├── LeadScoringRulesTable.tsx
└── EmailTemplatesTable.tsx
```

### Standard Component Features:
- ✅ CRUD Operations (Create, Read, Update, Delete)
- ✅ Search & Filter functionality
- ✅ Pagination support
- ✅ Modal dialogs for add/edit
- ✅ Detail view cards
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling
- ✅ Responsive design with Tailwind CSS
- ✅ React Icons for UI elements

---

## 📐 Navigation Integration

### New Routes Structure:

```
app/(dashboard)/
├── projects/
│   ├── layout.tsx
│   └── page.tsx
├── financial/
│   ├── invoices/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── expenses/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── payments/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── development/
│   ├── issues/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── code-reviews/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── releases/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── real-estate/
│   ├── properties/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── construction/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── inspections/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── contractors/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
└── marketing/
    ├── campaigns/
    │   ├── layout.tsx
    │   └── page.tsx
    ├── sequences/
    │   ├── layout.tsx
    │   └── page.tsx
    ├── templates/
    │   ├── layout.tsx
    │   └── page.tsx
    ├── scoring/
    │   ├── layout.tsx
    │   └── page.tsx
    ├── analytics/
    │   ├── layout.tsx
    │   └── page.tsx
    ├── layout.tsx
    └── page.tsx
```

---

## 🎯 Key Design Decisions

### 1. **Field Standardization**
- All tables include `_id`, `createdAt`, `updatedAt` for consistency
- Status fields use ENUM values for predictability
- User references use `owner_id`, `assigned_to`, `created_by` as appropriate

### 2. **Relationships**
- Foreign key references use String IDs (e.g., `client_id`, `project_id`)
- Can be expanded later to use MongoDB ObjectRef for validation
- Allows flexibility in API design

### 3. **Timestamps**
- All entities track creation and modification dates
- Enables audit trails and sorting by recency

### 4. **Status Fields**
- Enable filtering and workflow management
- Status values are consistent within entity type
- Allows historical tracking

### 5. **Calculated Fields**
- Auto-calculated fields: `progress_percentage`, `total_score`, `spent_amount`, `cost_per_lead`, etc.
- Computed on backend, stored for quick access
- Refresh triggers on related entity changes

---

## 🔐 Security & Permissions

### Role-Based Access Control:
```typescript
// Example permission levels per role
Roles: Admin, Manager, Team_Lead, Team_Member, Client, Guest

Permissions per Module:
- Project Management: View, Create, Edit, Delete (based on role)
- Financial: View, Create (restricted), Edit, Delete (admin only)
- Development: View, Create, Edit (dev lead+)
- Real Estate: View, Create, Edit, Delete (manager+)
- Marketing: View, Create, Edit (marketing team)
```

---

## 📊 Dashboard Integration

### Main Dashboard Cards to Add:
```
Project Management:
- Active Projects Count
- Projects Overdue
- Average Project Progress
- Team Utilization %

Financial:
- Total Revenue (This Month)
- Unpaid Invoices Count
- Total Expenses
- Cash Flow Chart

Development:
- Open Issues Count
- PR Pending Review
- Releases This Month
- Build Success Rate

Real Estate:
- Total Properties
- Under Construction Count
- Inspection Schedule
- Contractor Performance

Marketing:
- Active Campaigns
- Lead Score Average
- Email Open Rate
- Campaign ROI
```

---

## 📝 Notes

1. **Backend Alignment**: Ensure backend has matching data models before implementation
2. **API Validation**: All API endpoints should return consistent response format
3. **Error Handling**: Implement comprehensive error messages for user guidance
4. **Testing**: Create unit tests for services and component interactions
5. **Documentation**: Add JSDoc comments to all service methods
6. **Performance**: Implement pagination and lazy loading for large datasets
7. **Accessibility**: Ensure tables are keyboard navigable and screen reader friendly

---

## ✅ Checklist Before Implementation

- [ ] Backend models created and tested
- [ ] API endpoints documented
- [ ] Database schema validated
- [ ] Permission system defined
- [ ] UI/UX design approved
- [ ] Performance requirements defined
- [ ] Testing strategy finalized
- [ ] Deployment plan prepared

---

**Last Updated**: April 22, 2026  
**Version**: 1.0  
**Status**: Ready for Implementation
