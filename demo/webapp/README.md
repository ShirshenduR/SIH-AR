# KhadanAsAR — Web Demo App (mobile, camera + AR, no install)

A phone-first web app you open in the browser and **record** for the demo video.
Real marker-based AR runs in the browser (AR.js) — no Unity, no app store.

## Screens (all recordable)

| Page | What it shows | In the video |
|---|---|---|
| `index.html` | Onboarding — worker scans a QR to begin | opening shot |
| `ar.html` | **Live AR fire drill** — extinguisher + fire on a real marker, P.A.S.S. tap sequence, Hindi voice | the hero shot |
| `score.html` | Competency score + the 4-zone "how they decided" read | #1 wow factor |
| `verify.html` | Scan → **Verified ✓**, plus a tamper → **INVALID** shot | tamper-proof claim |
| `dashboard.html` | Supervisor dashboard + hazard heatmap | #3 wow factor |
| `recall.html` | Day-3 recall notification + 60s micro-drill | spaced repetition |

## The one requirement: HTTPS (camera needs it on a phone)

Phones only give camera access over **https** (or `localhost`). Easiest free option:

**GitHub Pages**
```bash
# from the repo root
git add demo/webapp && git commit -m "web demo"
git push
# then: repo Settings → Pages → deploy from branch (main /demo/webapp) 
# open https://<user>.github.io/<repo>/demo/webapp/ on your phone
```

**Or test locally on the same Wi-Fi (quickest):** run a tunnel so the phone gets https:
```bash
cd demo/webapp
python3 -m http.server 8123
# in another terminal, expose it with https:
npx localtunnel --port 8123      # or: ngrok http 8123
# open the https URL it prints, on your phone
```

## Recording the AR shot

1. Open `ar.html` on the phone (https). Allow the camera.
2. Print or display the **Hiro marker** — open `ar.html?marker=1` on a laptop/second screen, or print it.
3. Point the phone at the marker in a **bright room** → the extinguisher + fire appear anchored to the marker, EXIT arrow floating above.
4. Tap through **P.A.S.S.** (Pull → Aim → Squeeze → Sweep). Correct taps flash green + speak Hindi; the fire goes out on the last step.
5. Android built-in screen recorder captures it. Then cut to `score.html`, `verify.html`, `dashboard.html`, `recall.html`.

**No marker / tracking flaky?** Tap **"No marker handy? Show hazard anyway"** in `ar.html` — the 3D hazard renders in front of the camera so you can still record the full flow.

## Notes
- 3D props are built from primitives in `assets/ar-components.js`, so nothing depends on a model file downloading.
- The verify screen uses the same Ed25519 story as the real backend in `../qr-cert/`.
- Needs network on first load (fonts + AR.js from CDN). For fully offline, download those into `assets/` and swap the `<script>`/`<link>` URLs.
