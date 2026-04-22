# Software Project Management - Complete Structure

## Overview
Created a comprehensive Software Project Management system with three main sections under the Software menu:

1. **Track All Projects** - Monitor and manage all software projects
2. **Task Details** - Assign and manage tasks for team members  
3. **Project Status** - View project health and progress

---

## File Structure Created

### Pages & Routes
```
/app/(dashboard)/software/
├── page.tsx                    (Redirects to track-all-projects)
├── layout.tsx                  (Main layout with submenu navigation)
├── track-all-projects/
│   └── page.tsx               (Track All Projects page)
├── task-details/
│   └── page.tsx               (Task Details page)
└── project-status/
    └── page.tsx               (Project Status page)
```

### Components
```
/components/ui/
├── SoftwareTable.tsx          (Track All Projects - existing, now used by submenu)
├── TaskDetails.tsx            (Task management component)
└── ProjectStatus.tsx          (Project status overview component)
```

### Services
```
/src/services/
├── softwareService.ts         (Project management - existing)
└── taskService.ts             (Task management - new)
```

---

## Features

### 1. Track All Projects (`/software/track-all-projects`)
- View all software projects with details
- Filter and search projects
- View project workflow and features
- See problems/bugs encountered
- Access GitHub repository links
- Timeline visibility (start date → end date)
- Add/Edit/Delete projects
- Project status badges

**Fields:**
- Project Name
- Lead Name
- Technology Stack
- Workflow Description
- Problems Facing
- Repository URL
- Work Timeline
- Comments & Suggestions

### 2. Task Details (`/software/task-details`)
- Assign tasks to team members (Developers, Designers, Sales)
- Filter by:
  - Project
  - Role (Developer/Designer/Sales)
  - Status (Not Started/In Progress/Pending/Completed)
- Track task progress with percentage completion
- View submission deadlines
- Manage task priority (Critical, High, Medium, Low)
- Edit and update task progress
- View task notes and requirements

**Task Fields:**
- Project Name
- Task Title
- Assigned To (Team Member Name)
- Role (Developer/Designer/Sales)
- Description
- Priority Level
- Timeline & Submission Deadline
- Assigned By (Manager)
- Estimated Hours
- Completion Percentage
- Status
- Additional Notes

### 3. Project Status (`/software/project-status`)
- View project health status:
  - ✓ **Going Good** - Project on track
  - ⏸ **Postponed** - Project paused
  - ⏳ **Pending** - Awaiting action
  - ○ **No Tasks** - No assigned tasks
- Task breakdown (Completed, In Progress, Pending, Not Started)
- Overall progress percentage
- Team allocation per project
  - Number of Developers
  - Number of Designers
  - Number of Sales Staff
- Project timeline visibility
- Summary statistics:
  - Total Projects
  - Total Tasks
  - Average Progress %
  - Projects On Track

---

## Seed Data

### Software Projects (5 samples)
1. **E-Commerce Platform** (Mam Mahnoor)
2. **CRM Dashboard** (Mam Mahnoor)
3. **Mobile App - iOS** (Mam Aisha)
4. **Analytics Engine** (Mr. Ahmed)
5. **Admin Portal** (Mam Fatima)

### Tasks (8 samples)
- Distributed across projects
- Assigned to various roles (Developer/Designer/Sales)
- Multiple statuses (In Progress, Pending, Not Started, etc.)
- Different priority levels
- Completion percentages tracking

---

## Navigation Flow

```
Sidebar: Software
    ↓
/software (page.tsx)
    ↓
Redirects to → /software/track-all-projects
    ↓
Shows: Submenu Navigation Bar with 3 tabs
    ├─ Track All Projects (Active by default)
    ├─ Task Details
    └─ Project Status
```

### Submenu Navigation
Located in `layout.tsx`, shows three styled buttons:
- Icon + Label + Description
- Active state: Blue gradient background
- Inactive state: Light gray background
- Responsive design (stacks on mobile)

---

## Key Features

### Project Management
✅ Create/Edit/Delete projects
✅ Track project workflow
✅ Monitor team progress
✅ View problems and bugs
✅ Repository access
✅ Timeline management
✅ Project comments

### Task Assignment
✅ Assign tasks to developers, designers, sales
✅ Set submission deadlines
✅ Priority levels (Critical, High, Medium, Low)
✅ Progress tracking (0-100%)
✅ Status management
✅ Filter by project, role, status
✅ Task notes and requirements

### Project Status Monitoring
✅ Health status indicators
✅ Overall progress tracking
✅ Task breakdown visualization
✅ Team allocation overview
✅ Summary statistics
✅ Timeline visibility

---

## Usage

### Manager/CEO Workflow
1. Go to Software → Track All Projects
   - View all projects
   - Monitor workflow progress
   - See issues and problems
2. Click "New Project" to add new software projects
3. Go to Task Details
   - Click "Assign Task" to delegate work
   - Assign to developers/designers/sales
   - Set deadlines
4. Go to Project Status
   - Monitor overall health
   - See which projects are on track
   - Check team workload

### Developer Workflow
1. Go to Software → Task Details
2. Filter by role to see assigned tasks
3. View deadline and requirements
4. Monitor progress from manager updates

---

## Database Schema

### Project Schema
```typescript
{
  _id: string
  projectName: string
  technology: string
  leadName: string
  status: number (1=active)
  workflowDescription: string
  problemsFacing: string[]
  repositoryUrl: string
  startDate: string (YYYY-MM-DD)
  endDate: string (YYYY-MM-DD)
  projectStatus: 'Development' | 'Testing' | 'In Progress' | 'Completed'
  comments: string[]
}
```

### Task Schema
```typescript
{
  _id: string
  projectName: string
  taskTitle: string
  assignedTo: string
  role: 'Developer' | 'Designer' | 'Sales'
  description: string
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  timeline: string (start date)
  submissionDeadline: string (YYYY-MM-DD)
  status: 'Not Started' | 'In Progress' | 'Pending' | 'Completed'
  assignedBy: string (manager name)
  estimatedHours: number
  completedPercentage: number (0-100)
  notes: string
}
```

---

## Notes

- All data is currently seed/hardcoded data
- Services have commented sections for API integration
- When ready, replace fetch comments with actual API endpoints
- Responsive design for mobile and desktop
- Toast notifications for all actions
- Modal dialogs for create/edit operations
- Real-time filtering and status updates
