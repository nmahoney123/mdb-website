# Partner / Client Logos

Drop logo image files here to make them appear in the home-page **"Trusted by
Developers & Operators"** scrolling marquee.

## How it works
Each partner in `src/data/content.ts` (the `PARTNERS` array) points to a file in
this folder. Until the file exists, the marquee shows the partner's **name** as a
fallback — so nothing looks broken while you gather assets.

## File names expected (drop these exact names here)
| Partner | File |
|---|---|
| Microtel Inn & Suites | `microtel.png` |
| Extra Space Storage | `extra-space-storage.png` |
| Life Storage | `life-storage.png` |
| Forge Building Company | `forge-building.png` |
| Extreme Makeover: Home Edition | `extreme-home-makeover.png` |
| Fort Drum · U.S. Army | `fort-drum.png` |
| Gale Technology | `gale-technology.png` |

## Format tips
- **PNG or SVG with a transparent background** works best (the marquee is on a dark panel).
- Roughly **400×160 px** (or any wide-ish logo) — they're auto-fit to ~40px tall.
- The marquee applies a subtle grayscale that lifts to full color on hover.

## ⚠️ Rights note
Only add logos you are cleared to display. Client/"we've built for" logo walls are
common, but some marks carry restrictions — notably the **U.S. Army / Fort Drum**
insignia and **network-show branding** (Extreme Makeover: Home Edition). Use official
brand-kit assets and confirm permitted use.

Once the CMS work lands, these will also be manageable from the admin dashboard
(upload + reorder) instead of editing files here.
