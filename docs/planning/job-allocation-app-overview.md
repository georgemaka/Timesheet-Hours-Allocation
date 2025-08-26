# Job Allocation Web App – Project Overview

## Objective

Employees currently submit weekly timecards in Paypro. Separately, we need them to allocate their time **by job and phase (%)** for job costing.
This project delivers a **simple web/mobile app** where employees can log in weekly, allocate 100% of their time across one or more jobs/phases, and submit before a cutoff. Allocations will later be exported into Vista (ERP) for cost allocation.

Company name is Sukut Construction. Colors are blue, keep it simple and easy.

---

## Key Workflow

1. **Timecard Submission (external)**Employees submit hours through Paypro (no integration in v1).
2. **Allocation Entry (this app)**

   - User selects a **week**.
   - Adds one or more allocation lines: `{Job, Phase, %}`.
   - Allocations must sum to **100.00%** (two decimal precision).
   - PTO handled either by allocating into projects or flagged separately (decision TBD).
   - Zero-hour weeks: employee **skips**, system logs a marker (“No Allocation – 0 hours”).

3. **Submission & Locking**

   - Draft until submitted.
   - Once submitted, employee can edit until cutoff (e.g., Tuesday 12:00 PT).
   - After cutoff, edits require manager approval.

4. **Manager/Admin**

   - Managers can see team completion status.
   - Admin/Finance can unlock/reopen weeks if needed.

5. **Export to Vista**

   - Nightly or on-demand CSV export.
   - Percent-only export, downstream system multiplies % by costed hours (including premiums).
   - Vista sync provides job/phase list nightly.

---

## User Roles

- **Employee**

  - Enter allocations for themselves.
  - Submit and edit (until cutoff).

- **Manager**

  - View team allocation status.
  - Approve late changes.

- **Admin/Finance**

  - Run exports.
  - Manage job/phase sync.
  - Override cutoffs and unlock weeks.

---

## Business Rules

- Allocations must sum to **100.00%** exactly.
- Support **two decimal places**.
- PTO/Leave:
  - Must still total 100% across lines.
  - Zero-hour weeks are explicitly marked.
- Overtime/premiums: allocations apply **proportionally to total costed hours** (downstream, not in this app).
- Closed or inactive jobs/phases cannot be selected.
- Jobs & phases sync nightly from Vista.

---

## Data Sources

- **Jobs & Phases**: pulled from Vista tables (nightly sync).
- **Employees**: roster sync (id, name, manager, active).
- **Timecards**: not integrated in v1.

---

## Core Data Model (pseudo-code)

```plaintext
Employee {
  id, name, erp_emp_id, manager_id, active_flag
}

Job {
  id, erp_job_id, name, active_flag, start_date, end_date
}

Phase {
  id, job_id, code, name, active_flag, close_date
}

Week {
  id, start_date, end_date, cutoff_ts, status (open|locked)
}

AllocationHeader {
  id, employee_id, week_id, status (draft|submitted|locked),
  submitted_at, locked_at, has_zero_hours_flag
}

AllocationLine {
  id, header_id, job_id, phase_id, percent, note
}

ChangeRequest {
  id, header_id, requested_by, reason,
  old_json, new_json, status (pending|approved|denied),
  decided_by, decided_at
}

SyncLog {
  id, run_at, source, result, details
}
```
