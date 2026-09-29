# KhadanAsAR — Tier 2 Demo (Hybrid Video) Production Plan

Goal: a 60–90s demo video where the viewer believes the whole system works, backed by **one genuinely working AR moment** on a real Android phone. Everything else is polished mockup.

The rule: **build the AR overlay for real, screen-record it; everything else is a mock screen we record and cut together.**

---

## What's in this `demo/` folder (built for you, drop-in ready)

| Path | What it is | How you use it in the video |
|---|---|---|
| `qr-cert/` | Working Ed25519 signed-QR cert generate + verify (real crypto, matches your architecture) | Run it live, screen-record the "Verified ✓" moment |
| `screens/score.html` | Competency score screen (the 4-zone hesitation read) | Open in browser, screen-record — your #1 wow-factor shot |
| `screens/dashboard.html` | Admin dashboard + hazard heatmap | Open in browser, screen-record — your #3 wow-factor shot |
| `screens/*` (remaining) | onboarding-QR, recall-drill notification, cert verifier | Same — record browser, cut into video |

These are **phone-framed HTML mockups**: they look like real app screens but need no Unity, no backend. Open in Chrome, use device-toolbar (phone frame), screen-record. This is deliberately better than Figma for a non-designer — real motion, real fonts, offline, free.

---

## What YOUR TEAM must capture (the one real thing)

The single most convincing shot: **live marker-based AR on a real Android phone.**

Minimum viable AR moment (Fire & Explosion):
1. Print one high-contrast marker (A4). Test its quality with Google's `arcoreimg` tool (aim for score ≥ 75).
2. Point phone camera at marker → 3D fire extinguisher + a floating exit arrow appear anchored to the real room.
3. Tap-through the PASS sequence: **P**ull → **A**im → **S**queeze → **S**weep, each with a right/wrong feedback flash.
4. Screen-record it (Android built-in recorder) in a **bright room with a high-contrast marker** — never demo tracking in dim light.

That's the only Unity work required for Tier 2. One module, one marker, ~4 taps.

---

## Video script + shot list (~90s)

| Time | Visual (shot) | Narration (Hindi VO, English subtitle) |
|---|---|---|
| 0:00–0:12 | Title card + the stats (48 fatalities 2022-23; <20% retention in a week) | "Every year, workers die in Jharkhand's mines — many in their first 30 days. Training doesn't stick." |
| 0:12–0:22 | `screens/onboarding.html` — worker scans QR to log in | "No login, no reading. A worker just scans a QR to begin." |
| 0:22–0:45 | **REAL AR footage** — extinguisher overlay + PASS tap sequence | "They point their phone at a real hazard point. Training appears on their actual surroundings — guided by voice, in Hindi or Santali." |
| 0:45–0:58 | `screens/score.html` — competency score, 4-zone read | "We don't just check the answer. We measure *how* they decided — flagging the dangerous 'confidently wrong'." |
| 0:58–1:08 | `qr-cert` "Verified ✓" shot | "They earn a signed certificate — verifiable even offline, tamper-proof." |
| 1:08–1:20 | `screens/recall.html` notification + `screens/dashboard.html` heatmap | "Recall drills at day 3, 7, 30 fight forgetting. Supervisors see exactly where the whole site struggles." |
| 1:20–1:30 | Closing card | "KhadanAsAR — training that stays." |

---

## Task split (from your 6-person team)

| Person | Demo task |
|---|---|
| CSE #1 | Build the one AR module in Unity (marker + extinguisher + PASS taps) |
| CSE #2 | Wire the QR cert script into a clean "generate → scan → verified" demo flow |
| ECE BTech | Record all footage on a real mid-range Android; Hindi voiceover capture |
| ECE PhD #1 | Marker quality + lighting setup for the AR shot (make tracking rock-solid on camera) |
| ECE PhD #2 | Own the score/dashboard mock screens (tweak the HTML data to look realistic), stitch the final video |
| ME PhD | Write/verify the narration script; confirm the PASS sequence + safety content is correct |

---

## Freeze rule

Freeze scope by the halfway point. Whatever AR isn't working by then → replace that shot with a mock screen and keep moving. A clean 90s video with one real AR clip beats a broken full build every time.
