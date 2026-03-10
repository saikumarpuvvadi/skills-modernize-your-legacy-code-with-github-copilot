# COBOL Student Account System Test Plan

## Scope
This test plan covers the current business logic implemented across the COBOL programs:
- Main menu navigation and input handling
- Balance inquiry
- Credit transactions
- Debit transactions (including insufficient funds handling)
- In-memory balance updates across multiple operations in one session
- Exit behavior

## Test Cases

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | Display main menu on app start | Application compiled successfully; executable available | 1. Run the application.<br>2. Observe the first screen. | Menu is displayed with options 1 (View Balance), 2 (Credit Account), 3 (Debit Account), 4 (Exit). | TBD | TBD | Baseline UI/flow validation. |
| TC-002 | Validate initial balance via View Balance | Fresh app start; no prior transactions in current run | 1. Start app.<br>2. Enter option 1.<br>3. Observe balance output. | Current balance is shown as 1000.00. | TBD | TBD | Confirms default account starting value. |
| TC-003 | Handle invalid menu input (outside 1-4) | Application running at menu | 1. Enter invalid choice (example: 5).<br>2. Observe system response.<br>3. Confirm menu appears again. | System displays invalid choice message and continues loop without balance change. | TBD | TBD | Covers invalid branch in menu evaluation. |
| TC-004 | Exit application via option 4 | Application running at menu | 1. Enter option 4. | Application displays exit message and terminates normally. | TBD | TBD | Confirms controlled stop path. |
| TC-005 | Credit account with valid positive amount | Fresh app start; initial balance 1000.00 | 1. Enter option 2.<br>2. Enter credit amount 200.00.<br>3. Enter option 1 to view balance. | Credit success message shown; updated balance is 1200.00. | TBD | TBD | Validates read-add-write flow. |
| TC-006 | Debit account with sufficient funds | Fresh app start; initial balance 1000.00 | 1. Enter option 3.<br>2. Enter debit amount 250.00.<br>3. Enter option 1 to view balance. | Debit success message shown; updated balance is 750.00. | TBD | TBD | Validates read-subtract-write flow when funds are sufficient. |
| TC-007 | Debit account with insufficient funds | Fresh app start; initial balance 1000.00 | 1. Enter option 3.<br>2. Enter debit amount 1200.00.<br>3. Enter option 1 to view balance. | System shows insufficient funds message; balance remains 1000.00. | TBD | TBD | Confirms overdraft prevention rule. |
| TC-008 | Sequential transactions persist during same run | Fresh app start; initial balance 1000.00 | 1. Enter option 2 and credit 300.00.<br>2. Enter option 3 and debit 100.00.<br>3. Enter option 1 to view balance. | Final balance is 1200.00 (1000 + 300 - 100). | TBD | TBD | Confirms in-memory state continuity within one execution. |
| TC-009 | Multiple balance inquiries do not mutate state | Fresh app start | 1. Enter option 1.<br>2. Enter option 1 again.<br>3. Compare both outputs. | Same balance value is displayed both times when no write operation occurred. | TBD | TBD | Validates read-only behavior of balance inquiry. |
| TC-010 | Credit followed by restart resets to default value | App can be started and stopped | 1. Start app.<br>2. Credit 100.00.<br>3. Exit app.<br>4. Start app again.<br>5. View balance. | Balance returns to 1000.00 on new run (no persistent storage across executions). | TBD | TBD | Important implementation behavior for modernization planning. |
| TC-011 | Exact-balance debit is allowed | Fresh app start; initial balance 1000.00 | 1. Enter option 3.<br>2. Enter debit amount 1000.00.<br>3. Enter option 1 to view balance. | Debit succeeds; new balance is 0.00. | TBD | TBD | Verifies boundary condition for rule current balance >= debit amount. |
| TC-012 | Zero amount credit handling | Fresh app start | 1. Enter option 2.<br>2. Enter amount 0.00.<br>3. View balance. | Balance remains unchanged; transaction completes without crash. | TBD | TBD | Captures current implementation behavior; confirm expected business policy with stakeholders. |
| TC-013 | Zero amount debit handling | Fresh app start | 1. Enter option 3.<br>2. Enter amount 0.00.<br>3. View balance. | Balance remains unchanged; transaction completes without crash. | TBD | TBD | Captures current implementation behavior; confirm expected business policy with stakeholders. |
| TC-014 | Negative amount input behavior for credit/debit fields | Fresh app start | 1. Attempt to enter a negative amount in credit flow.<br>2. Repeat for debit flow.<br>3. Observe parser/application behavior. | Behavior is documented as-is (accept/reject/normalize/error) with no undefined outcomes. | TBD | TBD | Required discovery test before Node.js parity implementation. |
| TC-015 | Non-numeric amount input behavior | Fresh app start | 1. Enter option 2 or 3.<br>2. Provide non-numeric amount input.<br>3. Observe system output/termination behavior. | Behavior is documented as-is for migration requirements and validation rules. | TBD | TBD | Identifies input-validation gaps in legacy implementation. |

## Business Rules Coverage Mapping

| Business Rule | Covered By Test Case ID |
|---|---|
| Default opening balance is 1000.00 | TC-002 |
| Menu accepts options 1-4 and rejects others | TC-001, TC-003, TC-004 |
| View Balance reads current account state only | TC-002, TC-009 |
| Credit increases balance by entered amount | TC-005 |
| Debit is allowed only when balance is sufficient | TC-006, TC-011 |
| Insufficient funds prevent balance update | TC-007 |
| Balance updates remain available during the same app session | TC-008 |
| Balance is not persisted across app restarts | TC-010 |
| Edge input behavior (zero/negative/non-numeric) must be documented for modernization parity | TC-012, TC-013, TC-014, TC-015 |

## Stakeholder Sign-off Notes
- Fill Actual Result, Status (Pass/Fail), and Comments during business validation execution.
- Any mismatch between expected and actual legacy behavior should be marked for migration decision: preserve legacy behavior or introduce new validated rules in Node.js.
