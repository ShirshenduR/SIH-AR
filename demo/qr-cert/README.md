# QR Certificate Demo (Ed25519 signed, offline-verifiable)

Real crypto, matching the KhadanAsAR architecture. The private key signs;
the verifier needs only the public key, so verification works fully offline.

## Setup (one time)

```bash
cd demo/qr-cert
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

## Generate a certificate (produces a QR image)

```bash
python generate_cert.py --worker "Ramesh Munda" --module "Fire & Explosion" --score 86
```

Outputs a QR PNG + token in `out/`. First run also creates `keys/`.

## Verify it (offline — no network, no DB)

```bash
python verify_cert.py --file out/KAR-XXXXXXXXXX.token
```

Prints `RESULT: VALID ✓` with the certificate details.

## For the demo video — show tamper-proofing

Prove it can't be forged: edit one character in the `.token` file and re-run
verify. It prints `INVALID — signature does not match`. That single shot is
the strongest way to make the "tamper-proof, verifiable" claim believable.
