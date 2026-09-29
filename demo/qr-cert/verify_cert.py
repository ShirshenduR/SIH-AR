"""
KhadanAsAR — offline certificate verifier (demo).

Verifies a signed certificate token using ONLY the public key — no network,
no database. This is the whole point of the design: a supervisor can confirm
a certificate is genuine and unexpired even with zero connectivity.

Usage:
    python verify_cert.py --token "<paste token>"
    python verify_cert.py --file out/KAR-XXXXXXXXXX.token
"""

import argparse
import base64
import json
import pathlib
from datetime import date

from cryptography.hazmat.primitives import serialization
from cryptography.exceptions import InvalidSignature

KEYS_DIR = pathlib.Path(__file__).parent / "keys"


def b64url_decode(s: str) -> bytes:
    pad = "=" * (-len(s) % 4)
    return base64.urlsafe_b64decode(s + pad)


def load_public_key():
    pub_path = KEYS_DIR / "ed25519_public.pem"
    if not pub_path.exists():
        raise SystemExit("No public key found. Run generate_cert.py first.")
    return serialization.load_pem_public_key(pub_path.read_bytes())


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--token")
    ap.add_argument("--file")
    args = ap.parse_args()

    if args.file:
        token = pathlib.Path(args.file).read_text().strip()
    elif args.token:
        token = args.token.strip()
    else:
        raise SystemExit("Provide --token or --file")

    try:
        payload_b64, sig_b64 = token.split(".")
        payload_bytes = b64url_decode(payload_b64)
        signature = b64url_decode(sig_b64)
    except ValueError:
        raise SystemExit("RESULT: INVALID — malformed token")

    pub = load_public_key()
    try:
        pub.verify(signature, payload_bytes)
    except InvalidSignature:
        print("RESULT: INVALID — signature does not match (forged or tampered)")
        return

    payload = json.loads(payload_bytes)
    expired = date.fromisoformat(payload["exp"]) < date.today()

    print("RESULT:", "EXPIRED" if expired else "VALID \u2713")
    print("Certificate ID :", payload["cid"])
    print("Module         :", payload["m"])
    print("Score          :", payload["s"])
    print("Issued         :", payload["iss"])
    print("Expires        :", payload["exp"], "(EXPIRED)" if expired else "")


if __name__ == "__main__":
    main()
