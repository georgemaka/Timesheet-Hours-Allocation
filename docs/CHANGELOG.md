# Changelog

All notable changes to the Job Allocation Web App will be documented in this file.

## [1.0.0] - 2025-08-26 - Initial Release

### 🎯 Core Application
- **Project Initialization**: Set up React TypeScript frontend with Node.js Express backend
- **Professional UI**: Implemented Sukut Construction branding with blue color scheme (#1976d2)
- **Employee Interface**: Built main allocation entry form with professional table layout
- **Responsive Design**: Mobile-first approach with collapsible columns and touch-friendly controls

### 📊 Allocation Features
- **Dual Input Modes**: Toggle between percentage (0-100%) and hours-based input
  - Real-time conversion with configurable total hours (50hrs = 40 regular + 10 overtime)
  - Progress bar with color-coded completion status
- **100% Validation**: Precise validation ensuring allocations equal exactly 100.00%
- **Smart Distribution**: 
  - "Distribute Evenly" button for equal percentage splits
  - "Fill to 100%" button to complete remaining allocation

### 🏗️ Job vs Mechanic Work Types
- **Job Type Toggle**: Clean toggle buttons (not dropdown) for Job/Mechanic selection
- **Job Mode**: Construction project allocation
  - Job selection dropdown with ERP IDs and project names
  - Phase selection linked to chosen job
  - Work location tracking for tax compliance
- **Mechanic Mode**: Equipment maintenance tracking
  - Equipment selection (26+ construction equipment items)
  - Cost code selection (44+ maintenance/repair categories)
  - Automatic "Shop" location assignment

### 🌍 Work Location Intelligence
- **Out-of-State Jobs**: Smart dropdown with options:
  - "On-site in [Job State]" (default)
  - "Remote from [Home State]"
- **Local Jobs**: Automatic "Local" badge display
- **Mechanic Work**: Automatic "Shop" location designation
- **Tax Compliance**: Proper location tracking for multi-state operations

### ⚡ Productivity Features
- **Copy Previous Week**: Load last week's allocation as starting point
- **Bulk Job Entry**: Paste comma-separated job numbers to create multiple lines
- **Smart Defaults**: Auto-select first available phase when job is chosen
- **Quick Actions**: Streamlined add/remove line functionality

### 🎨 User Experience
- **Loading States**: Professional spinners and loading indicators
- **Message System**: Success/error notifications with auto-dismiss
- **Draft/Submit Workflow**: Save drafts before final submission
- **Employee Display**: Show current user (George Makakaufaki) with status
- **Form Validation**: Real-time feedback and error messaging

### 🔧 Technical Implementation
- **Backend API**: Express server with RESTful endpoints
  - `/api/jobs` - Active construction jobs
  - `/api/phases/:jobId` - Job-specific phases
  - `/api/equipment` - Construction equipment
  - `/api/cost-codes` - Maintenance cost codes
  - `/api/current-week` - Current week information
  - `/api/previous-allocation` - Previous week data
- **State Management**: React hooks with TypeScript interfaces
- **Professional Styling**: CSS Grid layout with 12px spacing for readability
- **Mobile Responsive**: Adaptive design for various screen sizes

### 📱 Professional UI Components
- **Toggle Controls**: Consistent design pattern for Job/Mechanic and Percentage/Hours
- **Table Layout**: 6-column grid with proper spacing and visual hierarchy
- **Visual Feedback**: Color-coded progress indicators and validation states
- **Action Buttons**: Professional gradient styling with hover effects
- **Help Text**: Contextual guidance for work location options

### 🏢 Business Logic
- **Allocation Validation**: Ensure either (Job + Phase) or (Equipment + Cost Code) is complete
- **Work Location Rules**: Different logic for job sites vs mechanic shop
- **Data Relationships**: Proper linking between jobs/phases and equipment/cost codes
- **Input Sanitization**: Proper handling of percentage vs hours calculations

### 🔄 Data Management
- **Dummy Data**: Comprehensive dataset for development
  - 5 construction jobs (including out-of-state projects)
  - 9 project phases across different jobs
  - 26 construction equipment items (excavators, dozers, loaders, trucks, cranes, etc.)
  - 44 maintenance cost codes (PM schedules, repairs, emergency work, etc.)
- **State Synchronization**: Proper data flow between frontend and backend
- **Type Safety**: Full TypeScript interfaces for all data structures

### 🎯 Known Items for Future Development
- SQL Server database integration (mssql package ready)
- Windows AD authentication
- Vista ERP system synchronization
- Manager approval workflows
- CSV export for payroll systems
- Multi-week view and historical data
- Advanced reporting and analytics

---

## Development Notes

### Key Architectural Decisions
- **React + TypeScript**: Type safety and modern development experience
- **Component-Based**: Modular design with AllocationForm as main component
- **RESTful API**: Clean separation between frontend and backend
- **Professional Styling**: Executive-ready interface suitable for business presentations

### Notable Bug Fixes
- **TypeScript Compilation**: Fixed `unknown` type casting in previous allocation loading
- **Mobile Layout**: Improved column spacing and responsive behavior
- **Input Validation**: Resolved decimal field cursor positioning issues
- **State Management**: Proper cleanup when switching between Job/Mechanic modes

### Performance Optimizations
- **Concurrent Loading**: Parallel API calls for jobs, phases, equipment, and cost codes
- **Efficient Updates**: Targeted state updates to minimize re-renders
- **Smart Caching**: Equipment and cost code data loaded once per session

---

*This changelog follows the principles of keeping a changelog and uses semantic versioning.*