# Version 2.0 verification

- `npm run check`: passes JavaScript syntax checks.
- `npm test`: 13 checks pass, including original regression checks plus hosted per-user isolation, repeat-safe setup, authorization identity rejection, encrypted snapshot round-trip, stale revisions, plaintext rejection and bridge origin/source/nonce/request binding.
- Hosted source requires a separate Apps Script deployment; owner authorization, live read/write, second-device read-back and a second real account are acceptance checks, not established by simulation.

Live hosted acceptance completed on 2026-11-15 in the owner's signed-in Google account: authorization succeeded; the embedded PWA handshake connected; setup created a private Sheet and a second setup reused its ID; an app-created disposable reflection synced to the Sheet as ciphertext; the actual Sheet ciphertext decrypted locally to exactly that test reflection; another sync successfully read/merged/wrote; the test reflection was deleted and the remote test snapshot cleared while retaining the Vault header. The disposable local encrypted vault was removed using the hosted Settings control; the Create your journal gate was verified afterward. The Sheet is empty below its header and ready for the owner's own passphrase. No real journal content was used.

The Google Sheet UI confirmed Private to only me. A second real Google account, mobile installation and an independent second-device read-back remain untested. Google OAuth verification is not complete; new users may see the unverified-app warning. All 13 automated checks and syntax checks pass on current main.

Previous implementation verification follows for historical context.

# Verification · 11 November 2026

## Automated

`npm run check` passes JavaScript syntax checks. `npm test` passes 10 checks:

1. Every declared service-worker app asset exists.
2. App HTML, main CSS and bundled font CSS contain no external runtime URLs.
3. Selected body, secondary, placeholder and primary-action contrast pairs exceed 7:1. This is not a full composited UI/state accessibility audit.
4. Apps Script journal API rejects incorrect authorization (mocked Apps Script services).
5. Encrypted chunk write/read round trip and stale-revision rejection (mocked services).
6. Backend rejects unencrypted input.
7. AES-GCM round trip, fresh randomness and absence of plaintext in ciphertext.
8. Incorrect passphrase and modified ciphertext fail decryption.
9. Newer deletion markers survive merging an older device copy.
10. Invalid imported/remote journal records are rejected.

Backend tests execute the actual `Code.gs` in a Node VM with service mocks. They do not establish Google authorization, iframe embedding, quotas, or live spreadsheet access.

## Browser walkthrough observed

- Home and reflection screens render in the managed Chrome preview.
- A demonstration journal was unlocked with a test-only passphrase.
- Event title and trigger entered; four emotion checkpoints displayed.
- A mixed feeling was explored; an Afraid selection and intensity of 1 persisted through review.
- Behavior and an if–then plan entered; the reflection saved successfully.
- Reload re-locked the journal; entering the same passphrase restored the saved entry.
- Saved-plan rehearsal rendered the stored plan.
- Appearance changed from Cyber Cyan to Neon Purple and saved.
- Explicit zero-intensity recording was verified separately from an unanswered rating.
- Final home inspection showed the Obsidian canvas, local Outfit/Inter fonts, Font Awesome route icon, translucent layered cards, and cyan/blue/purple ambient lighting.

## Deployment acceptance still required

- GitHub repository creation, source push, Pages activation and successful live deployment. The browser GitHub passkey attempt reported partial support and authentication failed; no successful sign-in is claimed.
- Apps Script project installation, authorization, private Sheet creation, deployment, token verification, live read/write and second-device merge.
- Live timeout, token rejection, wrong-passphrase no-write, and concurrent-device conflict behavior across the iframe bridge.
- Android and iOS installation; offline reload and editing after first successful install/cache.
- Narrow/mobile widths, zoom, assistive technology, Safari and all composited contrast states.
- Security and clinical content review before adoption in a care setting.
