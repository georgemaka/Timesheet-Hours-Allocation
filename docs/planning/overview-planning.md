Users will use a third-party timekeeping system to record their in and out times. For job allocations, users will use this web app interface to record their times.

Items to note:

- for payroll, if employee work in a job that is out-of-state, payroll needs to be notified so that they can adjust that employees taxes
  - Example,employee lives in Texas that has no state income tax. That employee travels to work at a job that is in Nevada. Payroll needs to be made aware that they are in Nevada. The other scenario is that employee can work on job items for that job and charge hours to it, however, they are doing it from their home state, therefore, no need to tell payroll to change taxes.

1. Employee Home State: Does the system need to track each employee's home state, or can we assume all employees are from the same state (Texasin your example)? The employee home state is currently in the system and tracked. It is assumed that each employee is in their home state by default, unless told otherwise
2. Payroll Integration: How does payroll currently receive this data? Is it manual review, CSV export, or direct system integration? Currently, it's a manual review from payroll. They review the out of state jobs and question the employees that worked it
3. Multi-state Complexity: Do you have employees who might work across multiple states in the same week? (e.g., Monday-Tuesday on-site in
   Nevada, Wednesday-Friday remote from Texas) Yes
4. Validation Requirements: Should the system prevent or warn about certain combinations (e.g., 100% remote work on a job that requires on-site
   presence)? No
