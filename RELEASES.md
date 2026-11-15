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
