# Job Cost Allocation Application - Production Development Plan

## Executive Summary

Production-ready job allocation web application for Sukut Construction to track employee time allocation across construction jobs/phases and equipment maintenance work for job costing and tax compliance purposes.

## Core Requirements (From Prototype Analysis)

### Employee Allocation Features

- **Dual Work Types**: Toggle between construction job work and mechanic/equipment maintenance
- **Job Allocation**: Select job → phase → work location (local/out-of-state)
- **Mechanic Allocation**: Select equipment → cost code → automatic "Shop" location
- **Flexible Input**: Toggle between percentage (0-100%) and hours input modes
- **Out-of-State Tax Tracking**: Track work location for tax compliance
  - On-site work in job's state vs remote work from home state
  - Automatic flagging of out-of-state employees for payroll adjustment
- **Smart Features**:
  - Copy previous week allocation
  - Bulk job entry (comma-separated job numbers)
  - Auto-distribute percentages evenly
  - Fill to 100% completion
  - Real-time validation (must equal exactly 100.00%)

### Data Integration Requirements

- **Vista ERP Integration**: Pull job cost tables, phases, equipment data (daily sync)
- **SQL Server Database**: Production data storage
- **PayPro Integration**: Track submitted timesheet hours and identify allocation gaps
- **Viewpoint Export**: Generate templates ready for payroll system upload
- **Unallocated Hours Handling**: Soft landing approach with pending allocation GL code

### Administrative Features

- **Employee Dashboard**: View all employees and submission status
- **Weekly Tracking**: Monitor who has/hasn't submitted allocations
- **Out-of-State Notifications**: Alert payroll of employees working out-of-state
- **Manager Approval**: Workflow for late changes and approvals
- **Audit Trail**: Track all allocation activity and changes

## Phase 1: Foundation & Infrastructure (Weeks 1-3)

### 1.1 Development Environment Setup

- **Backend**: Node.js/Express with TypeScript
- **Frontend**: React 18 with TypeScript (Vite instead of CRA for better performance)
- **Database**: SQL Server with Entity Framework/Prisma ORM
- **Authentication**: Windows AD integration (passport-windowsauth)
- **API**: RESTful with OpenAPI/Swagger documentation

### 1.2 Database Design & Schema

```sql
-- Core tables based on prototype analysis
Tables: Users, Jobs, Phases, Equipment, CostCodes, WeeklyAllocations,
        AllocationLines, PayProImports, UnallocatedHours, AuditLogs, 
        SystemSettings, Departments

-- PayPro integration table
PayProImports {
  employee_id: int,
  week_id: int,
  regular_hours: decimal(5,2),
  overtime_hours: decimal(5,2),
  total_hours: decimal(5,2),
  import_date: datetime,
  payroll_status: 'pending'|'processed'|'locked'
}
```

### 1.3 Infrastructure Setup

- **Development**: Docker containers for SQL Server, Redis, Node.js
- **CI/CD**: GitHub Actions for build, test, deploy
- **Monitoring**: Application insights, logging (Winston/Pino)
- **Security**: CORS, rate limiting, input validation, SQL injection protection

## Phase 2: Core Application Development (Weeks 4-8)

### 2.1 Backend API Development

- **Authentication & Authorization**: Windows AD integration
- **Data Models**: Jobs, phases, equipment, cost codes, allocations
- **API Endpoints**: CRUD operations with proper error handling
- **Data Validation**: Server-side validation for all inputs
- **File Upload**: CSV export/import functionality

### 2.2 Frontend Development

- **Component Architecture**: Reusable components with proper TypeScript interfaces
- **State Management**: Redux Toolkit or Zustand for complex state
- **Form Management**: React Hook Form with Yup validation
- **UI Framework**: Material-UI or Ant Design for professional appearance
- **Responsive Design**: Mobile-first approach

### 2.3 Business Logic Implementation

- **Allocation Engine**: Percentage/hours conversion logic
- **Validation Rules**: 100% allocation requirement, job/phase validation
- **Work Location Logic**: Out-of-state detection and tracking
- **Copy Previous Week**: Smart duplication with validation
- **Unallocated Hours Engine**: PayPro integration with pending allocation tracking

## Phase 3: Integration & Advanced Features (Weeks 9-12)

### 3.1 External System Integration

- **Vista ERP**: Daily sync of jobs, phases, equipment data
- **SQL Server**: Production database connection
- **PayPro Integration**: Weekly upload of submitted timesheet hours by employee
  - Import actual regular/overtime hours after employee timesheet submission
  - Handle timing mismatch: employees allocate percentages before PayPro upload
  - True-up process: recalculate allocations when actual hours imported
  - Track payroll processing status (estimated/actual/processed/locked)
- **Windows AD**: Single sign-on authentication

### 3.2 Administrative Features

- **Admin Dashboard**: Real-time submission tracking
- **Unallocated Hours Dashboard**: View employees with hours but no allocation
- **Reporting**: Weekly allocation reports, out-of-state tracking
- **User Management**: Role-based access control
- **Force Allocation**: Admin ability to allocate others' time when needed
- **System Configuration**: Settings management interface

### 3.3 Export & Reporting

- **Viewpoint Export**: CSV templates for payroll upload
- **Custom Reports**: Allocation summary, audit trails
- **Email Notifications**: Automated reminders and alerts

## Phase 4: Testing & Quality Assurance (Weeks 13-15)

### 4.1 Testing Strategy

- **Unit Tests**: Jest for business logic, React Testing Library for components
- **Integration Tests**: API endpoint testing with supertest
- **E2E Tests**: Playwright for critical user flows
- **Performance Tests**: Load testing with k6 or Artillery
- **Security Tests**: OWASP security scanning

### 4.2 Quality Gates

- **Code Coverage**: Minimum 80% coverage requirement
- **Performance**: Sub-2 second page load times
- **Accessibility**: WCAG 2.1 AA compliance
- **Browser Support**: Chrome, Edge, Firefox (latest 2 versions)

## Phase 5: Deployment & Production (Weeks 16-18)

### 5.1 Production Environment

- **Hosting**: Azure App Service or IIS on Windows Server
- **Database**: SQL Server production instance
- **Load Balancing**: Application Gateway for high availability
- **SSL/TLS**: Certificate management and HTTPS enforcement
- **Backup Strategy**: Automated database backups

### 5.2 Monitoring & Maintenance

- **Application Monitoring**: Azure Application Insights or New Relic
- **Error Tracking**: Sentry for error reporting and alerting
- **Performance Monitoring**: Real user monitoring and synthetic tests
- **Log Aggregation**: Centralized logging with search capabilities

### 5.3 User Training & Rollout

- **Documentation**: User guides and admin documentation
- **Training Sessions**: Employee and admin training
- **Phased Rollout**: Pilot group → department → full rollout
- **Support Process**: Help desk procedures and FAQ

## Technical Architecture

### Backend Stack

- **Framework**: Node.js 18+ with Express and TypeScript
- **Database**: SQL Server 2019+ with Prisma ORM
- **Authentication**: Passport.js with Windows AD strategy
- **Validation**: Joi or Yup for request validation
- **Testing**: Jest + Supertest for API testing

### Frontend Stack

- **Framework**: React 18 with TypeScript and Vite
- **UI Library**: Material-UI or Ant Design
- **State Management**: Redux Toolkit Query for API state
- **Forms**: React Hook Form with Yup validation
- **Testing**: Jest + React Testing Library + Playwright

### DevOps Stack

- **Version Control**: Git with feature branch workflow
- **CI/CD**: GitHub Actions with automated testing and deployment
- **Containerization**: Docker for development and optional production
- **Monitoring**: Application Insights, Sentry, and custom dashboards

## Security Considerations

### Authentication & Authorization

- Windows AD integration for seamless SSO
- Role-based access control (Employee, Manager, Admin, Super Admin)
- Session management with secure cookies
- API rate limiting and request throttling

### Data Protection

- Input validation and sanitization
- SQL injection prevention with parameterized queries
- XSS protection with Content Security Policy
- Sensitive data encryption at rest and in transit

### Compliance

- Audit logging for all user actions
- Data retention policies
- GDPR compliance for employee data
- Regular security assessments

## Performance Requirements

### Response Times

- Page load times: < 2 seconds
- API responses: < 500ms for typical requests
- Database queries: < 100ms for standard operations
- Concurrent users: Support 100+ simultaneous users

### Scalability

- Horizontal scaling capability
- Database connection pooling
- Caching strategy (Redis for session and data caching)
- CDN for static assets

## Maintenance & Support

### Ongoing Requirements

- **Data Sync**: Daily Vista ERP integration maintenance
- **User Support**: Help desk procedures and escalation
- **System Updates**: Regular security patches and feature updates
- **Backup & Recovery**: Automated backups with tested recovery procedures

### Documentation Requirements

- **Technical Documentation**: API docs, database schema, deployment guides
- **User Documentation**: Employee guides, admin manuals, troubleshooting
- **Process Documentation**: Change management, incident response procedures

## Success Metrics

### Business Metrics

- Time allocation submission compliance rate (target: 95%+)
- Reduction in payroll processing time
- Improved accuracy of job costing data
- Reduced manual intervention for out-of-state tax tracking

### Technical Metrics

- System uptime (target: 99.5%+)
- Average response time < 2 seconds
- Zero critical security vulnerabilities
- User satisfaction score > 4.0/5.0

## Risk Mitigation

### Technical Risks

- **Vista ERP Integration**: Plan for API changes, implement robust error handling
- **Performance**: Load testing and optimization before production
- **Security**: Regular security audits and penetration testing
- **Data Loss**: Comprehensive backup and disaster recovery plan

### Business Risks

- **User Adoption**: Comprehensive training and phased rollout
- **Process Changes**: Change management and stakeholder buy-in
- **Compliance**: Regular review of tax requirements and regulations

## Project Timeline Summary

**Total Duration**: 18 weeks (4.5 months)

- **Phase 1**: Foundation (3 weeks)
- **Phase 2**: Core Development (4 weeks)
- **Phase 3**: Integration (4 weeks)
- **Phase 4**: Testing (3 weeks)
- **Phase 5**: Deployment (4 weeks)

**Key Milestones**:

- Week 3: Infrastructure and database ready
- Week 8: Core application MVP complete
- Week 12: Full feature set with integrations
- Week 15: Testing complete, production ready
- Week 18: Production deployment and training complete

## Unallocated Hours Strategy (Option A: Soft Landing)

### Business Process
1. **Employee Allocation**: Employees allocate percentages using estimated/standard hours
2. **PayPro Upload**: Weekly import of actual submitted timesheet hours by employee
3. **True-Up Process**: System recalculates allocation hours using actual PayPro data
4. **Variance Detection**: Flag significant differences between estimated vs actual
5. **Admin Oversight**: Dashboard shows allocation status and hour variances
6. **Final Export**: Generate Viewpoint export with actual hours and allocations

### Technical Implementation
```typescript
interface PayProImport {
  employee_id: number;
  week_id: number;
  regular_hours: number;
  overtime_hours: number;
  total_hours: number;
  import_date: Date;
  payroll_status: "pending" | "processed" | "locked";
}

interface AllocationLine {
  employee_id: number;
  week_id: number;
  job_id?: number;
  phase_id?: number;
  equipment_id?: number;
  cost_code_id?: number;
  percentage: number;
  estimated_hours: number;    // Based on employee's standard schedule
  actual_hours?: number;      // Calculated after PayPro import
  work_location: string;
  allocation_status: "estimated" | "actual" | "variance_flagged";
}
```

### Admin Dashboard Features
- **Unallocated Hours Report**: Real-time view of employees with pending allocation
- **PayPro Integration Status**: Shows which employees submitted hours vs allocations
- **Aging Analysis**: 1-day, 3-day, 1-week+ unallocated hours tracking
- **Force Allocation**: Admin can allocate employee time to default job/equipment
- **Contact Integration**: Direct links to email/call employees with missing allocations
- **Bulk Resolution**: Apply previous week patterns to multiple employees at once
- **Validation Enforcement**: Prevent allocation exceeding PayPro submitted hours

## Questions

- Who approves allocations and when?
- Who can view allocations? Who can over-ride allocations?
- If allocations are not completed by payroll submission, what happens?
- ~~For unallocated costs, how do we ensure that this can be tied back to specific users that have not yet allocated their time?~~ **RESOLVED: Soft landing approach with PENDING-ALLOCATION GL code**
