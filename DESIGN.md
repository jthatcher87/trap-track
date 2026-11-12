# PNiXStudio · Trap Track design implementation

Requested by the owner: Material 3 + Liquid Glass blend. Source: `pnix_brand_guide`, Sovereign Liquid M3 v1.0 Production PRJ-002, read from the connected Google Doc on 11 November 2026. Also consulted the 21 October reconciliation matrix, which remains a proposed matrix rather than independent approval of all exceptions.

## Applied source tokens

| Role | Implementation |
|---|---|
| Canvas / Surface Dim | Obsidian Void `#020617` |
| Accents | Cyber Cyan `#06b6d4`, Electric Blue `#3b82f6`, Neon Purple `#a855f7`, Hot Pink `#ec4899` |
| Ambient decorative gradients | Cyan/Blue/Purple only |
| Surface Low | Subpanels, notices, pills: alpha .40 / blur 12px |
| Surface Base | Standard cards: alpha .65 / blur 16px |
| Surface High | Controls, elevated preview card: alpha .75 / blur 24px |
| Surface Highest | Status overlay: alpha .90 / blur 32px |
| Hairline highlight | White .12, top edge strengthened for specular depth |
| Shadow | 20px Y offset; blur and color are project additions |
| Display Large | Outfit 57/64px, 400, -.25px tracking |
| Display Medium | Outfit 45/52px, 400, 0 tracking; mobile display mapping is a project choice |
| Headline Large | Outfit 32/40px, 600, 0 tracking |
| Body Large | Inter 16/24px, 400, +.5px tracking |
| Label Medium | Inter 12/16px, 600, +.5px tracking, uppercase |
| Metrics | JetBrains Mono 13/20px, 500, 0 tracking |

## Project additions and boundaries

- Surface RGB `15,23,42`, secondary text `#dbe4f2`, borders, Material-shaped 28px cards and 48px minimum controls are project-level choices, not values claimed to be specified in the guide.
- Cyan primary with Obsidian text; optional purple atmosphere retains a white primary for text contrast. Action-color policy was unresolved in the matrix. These are reviewable application choices under the owner's instruction, not edits to the governing guide.
- All ordinary prose is white or a high-contrast light neutral, never low-contrast accent text. Check actual composites and interaction states before declaring conformance. Font Awesome mood icons use a consistent 32px base with modest size distinctions; text labels carry their meaning.
- Self-hosted Inter, Outfit, JetBrains Mono and Font Awesome assets allow offline use and avoid third-party runtime font requests. System fallbacks remain available.
- Brand attribution is plain text `by PNiXStudio` matching the owner's project name. No supplied approved corporate lockup was available; the app does not recreate the cyan cube or certify corporate-logo geometry/clearance.
- Multi-file ES modules are deliberate for service-worker caching and a separately deployed GAS backend. This is standalone and zero-build, but does not claim the process guide's single-HTML-file architecture requirement.
- Opaque fallback surfaces apply without backdrop-filter or when reduced transparency is requested. Reduced motion disables animations; the design uses no autoplay, animated emotional scoring, or forced progress mechanics.
- No claim of complete WCAG AAA compliance, exact optical certification, or clinical efficacy. Static contrast pairs, keyboard operation, local desktop flow, and security/data tests are recorded in TESTING.md; mobile/live cloud acceptance remains pending.
