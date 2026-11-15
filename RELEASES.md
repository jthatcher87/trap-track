# Release record

## 1.0 backup

- Exact pre-2.0 repository commit: `53307f01be5153da5013883b0d04d31ae282120c`.
- Preserved GitHub branch: `backup/v1.0`.
- Includes the existing PWA, individual Apps Script backend and in-app client setup guide.
- This is a source backup; it does not copy private Sheets, script properties, deployed Google projects or browser records.

## 2.0.0

- Hosted setup and journal workspace using each signed-in Google user's account.
- Idempotent private Sheet creation, user-scoped configuration and locks; no copied client tokens.
- Existing client-side encryption, snapshot format and individual deployments preserved.
- Guided migration with encrypted backup; no automatic journal movement or deletion.
- Version in package.json, VERSION and interface; offline asset cache refreshed.
- Live acceptance results are recorded in TESTING.md. Do not infer public OAuth verification from code completion.

### Review and approval

- Reviewed and approved by Josh Thatcher on 2026-11-15 (America/Chicago), explicitly authorizing v2.0 live deployment with Google Sheets access, email identity checks, access for signed-in Google users, and execution as each client.
- Google hosted service deployed as User accessing the web app / Anyone with Google account, deployment version 1 (product version 2.0.0).
- Service URL: https://script.google.com/macros/s/AKfycbwc5Be2N5cbxBloQEF_7ursf-uRHzcFAaSjyJbBWraU8Wujb_6Uq2uZ4OqE9r8Pp7CqeQ/exec
- Source promoted to main. Owner Google account verification is still required before completing hosted end-to-end acceptance. Approval is the product owner's approval, not Google OAuth verification or a claim that all live checks passed.
