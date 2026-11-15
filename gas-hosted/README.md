# Trap Track 2.0 hosted Google service

Install these files in a **new standalone Apps Script project**, separate from `gas/` (the 1.0 individual backend). Do not replace the old deployment or its Script Properties.

## Owner deployment

1. Create a standalone project. Copy Code.gs; add HTML named Hosted and paste Hosted.html. Enable manifest editing in Project Settings; replace appsscript.json with this directory's manifest.
2. Save. Deploy → New deployment → Web app. Choose **Execute as: User accessing the web app** and **Who has access: Anyone with Google account** (the manifest names these USER_ACCESSING and ANYONE). Never choose Execute as Me. Each client authorizes the service in their own account.
3. The service requests spreadsheet access and account email identity. Spreadsheet access is broad; email is used to fail closed when active and effective identities differ, not stored or logged by this code. Public client rollout may require a standard Cloud project, OAuth consent configuration and Google's verification; account and organization restrictions apply. Do not describe an unverified owner-only test as a public production launch.
4. Copy the deployed /exec URL into `app/hosted-config.js` as HOSTED_URL. It is public configuration, not a secret. Commit and deploy the PWA. The hosted HTML embeds that PWA using a pinned HTTPS URL.
5. Open the endpoint, authorize Google, and verify the app shows **Google workspace** and **Create my private Sheet**. Run setup twice and check it returns the same Sheet. Verify Share → Restricted.
6. Save a harmless test reflection, sync, reopen the same hosted URL on another clean browser/device with the same Google account and passphrase, and sync. Confirm encrypted read-back, then delete the test in the app and sync. Repeat with a second Google account to validate live account isolation. Unit simulation is not a replacement for that acceptance check.

## Isolation and transport

Sheet IDs are kept in **UserProperties**, never shared ScriptProperties. User locks serialize each person's setup and sync. No request accepts a caller-supplied Sheet ID. Revisions protect concurrent writes. A deployment identity check runs before every API request and doGet. Setup creates no credential token; Google's authorized session selects the user.

The top-level Google page completes sign-in. Its sandboxed HTML embeds the existing GitHub-hosted PWA. A nonce-bound postMessage bridge validates the app origin, iframe source, Google parent origin, nonce and request IDs. Only encrypted snapshots cross the bridge. The hosted page uses google.script.run; no OAuth credentials are passed to GitHub or included in URLs. The initial readiness nonce is not an access credential.

The operator controls hosted code, so this does not promise protection against a malicious future code update. Do not log journal data or payloads. Clients can revoke permissions through Google Account connections. Google history and backups may retain previous ciphertext.

## Existing clients and offline use

The original `gas/` backend, endpoint settings, encryption format and `traptrack.v1` storage key remain supported. Nothing automatically migrates or deletes journals. Export an encrypted backup from the previous journal, unlock the new workspace with its original passphrase, restore, sync, and verify before removing old copies.

The Google workspace requires Internet and is not itself an installable PWA. The standalone GitHub app remains installable and offline-capable. Browsers can partition/restrict embedded local storage; standalone and hosted contexts may hold separate local copies. Never assume switching Google accounts also switches the browser's locally encrypted journal; lock and confirm the appropriate passphrase and records before syncing another account. A dedicated browser profile per account is recommended.

## Updates and rollback

Update this project through Deploy → Manage deployments → Edit → New version → Deploy to keep its URL. Do not edit or archive the 1.0 deployment during rollout. Restore GitHub from `backup/v1.0` if rollback is required; retain all Sheets and encrypted backups. A code backup does not contain Google deployments, Script Properties, local journals or Sheet data.
