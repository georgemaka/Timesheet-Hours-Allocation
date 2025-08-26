# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a job allocation web app for Sukut Construction that allows employees to allocate their weekly time across construction jobs/phases or equipment maintenance work for job costing purposes. The app ensures allocations total exactly 100% and handles out-of-state tax requirements.

## Architecture

**Frontend (React TypeScript):**
- `client/` - Create React App with TypeScript
- `client/src/components/AllocationForm.tsx` - Main allocation entry component with dual-mode support (percentage/hours input)
- `client/src/components/AllocationForm.css` - Component styling with professional Sukut blue branding

**Backend (Node.js Express):**
- `server/index.js` - Express API server with CORS enabled
- Currently uses dummy data for jobs, phases, equipment, and cost codes
- Designed to integrate with SQL Server and Vista ERP system

**Key Data Models:**
- Jobs: Construction projects with out-of-state flags and location data
- Phases: Project phases linked to specific jobs
- Equipment: Heavy construction equipment for mechanic work
- Cost Codes: Maintenance/repair categories for equipment work
- AllocationLines: Support both job-based and mechanic-based time allocation

## Development Commands

**Full Development:**
```bash
npm run dev          # Runs both frontend and backend concurrently
npm run install-all  # Installs dependencies for both client and server
```

**Frontend Only:**
```bash
npm run client       # Starts React dev server (port 3000)
cd client && npm test # Runs React tests
```

**Backend Only:**
```bash
npm run server       # Starts Express server with nodemon (port 5000)
```

**Production Build:**
```bash
npm run build        # Builds React app for production
```

## Key Features

**Dual Input Modes:**
- Toggle between percentage (0-100%) and hours input
- Real-time conversion with 40 regular + 10 overtime hours example
- Progress bar with color coding (green/yellow/red based on completion)

**Job vs Mechanic Work:**
- Toggle button to switch between "Job" and "Mechanic" allocation types
- Job mode: Select construction job → phase → work location (local/out-of-state)
- Mechanic mode: Select equipment → cost code → automatically shows "Shop" location

**Smart Features:**
- Copy previous week's allocation as starting point
- Bulk job entry (paste comma-separated job numbers)
- Auto-distribute percentages evenly across lines
- Fill to 100% button for quick completion
- Real-time validation ensuring total equals 100%

**Work Location Handling:**
- Out-of-state jobs show dropdown: "On-site in [State]" vs "Remote from [Home State]"
- Local jobs show "Local" badge
- Mechanic work shows "Shop" location

## UI/UX Patterns

- Professional toggle buttons (similar to percentage/hours toggle) instead of dropdowns where appropriate
- Grid layout with proper spacing (12px gaps) for table readability
- Loading states, error handling, and success messaging
- Mobile-responsive design with collapsible columns
- Sukut Construction blue branding (#1976d2) with gradients and shadows

## Business Logic

- Allocations must total exactly 100.00% (validated to 0.01% precision)
- Support for both regular construction work and equipment maintenance tracking
- Out-of-state work location tracking for tax compliance
- Disabled validation ensures proper job/phase or equipment/cost code selection

## Future Integration Points

- SQL Server database connection (mssql package included)
- Vista ERP system sync for jobs/phases/equipment data
- Windows AD authentication
- Manager approval workflows for late changes
- CSV export functionality for payroll integration