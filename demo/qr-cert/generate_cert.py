"""
KhadanAsAR — signed certificate generator (demo).

Mirrors the real architecture: an Ed25519 private key (held server-side)
signs a compact certificate payload. The signed token is encoded into a QR
image that a verifier can check OFFLINE using only the public key.

Usage:
    python generate_cert.py --worker "Ramesh Munda" --module "Fire & Explosion" --score 86

First run creates keys/ed25519_private.pem + keys/ed25519_public.pem.
Keep the private key server-side; ship only the public key in the verifier app.
"""

import argparse
import base64
import hashlib
import json
import pathlib
from datetime import date, timedelta

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey

import qrcode

KEYS_DIR = pathlib.Path(__file__).parent / "keys"
OUT_DIR = pathlib.Path(__file__).parent / "out"


def b64url(data: bytes) -> str:
    """URL-safe base64 without padding — keeps the QR payload compact."""
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def load_or_create_private_key() -> Ed25519PrivateKey:
    KEYS_DIR.mkdir(exist_ok=True)
    priv_path = KEYS_DIR / "ed25519_private.pem"
    pub_path = KEYS_DIR / "ed25519_public.pem"

    if priv_path.exists():
        return serialization.load_pem_private_key(priv_path.read_bytes(), password=None)

    key = Ed25519PrivateKey.generate()
    priv_path.write_bytes(
        key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption(),
        )
    )
    pub_path.write_bytes(
        key.public_key().public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo,
        )
    )
    print(f"Generated new keypair in {KEYS_DIR}/")
    return key


def build_payload(worker: str, module: str, score: int, valid_days: int) -> dict:
    issued = date.today()
    expires = issued + timedelta(days=valid_days)
    # Store a hash of the worker id, not the raw name — privacy by design.
    worker_hash = hashlib.sha256(worker.encode("utf-8")).hexdigest()[:16]
    return {
        "cid": "KAR-" + hashlib.sha256(f"{worker}{module}{issued}".encode()).hexdigest()[:10].upper(),
        "w": worker_hash,
        "m": module,
        "s": score,
        "iss": issued.isoformat(),
        "exp": expires.isoformat(),
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--worker", required=True)
    ap.add_argument("--module", required=True)
    ap.add_argument("--score", type=int, required=True)
    ap.add_argument("--valid-days", type=int, default=180)
    args = ap.parse_args()

    key = load_or_create_private_key()
    payload = build_payload(args.worker, args.module, args.score, args.valid_days)

    payload_bytes = json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8")
    signature = key.sign(payload_bytes)
    token = f"{b64url(payload_bytes)}.{b64url(signature)}"

    OUT_DIR.mkdir(exist_ok=True)
    img = qrcode.make(token)
    qr_path = OUT_DIR / f"{payload['cid']}.png"
    img.save(qr_path)
    (OUT_DIR / f"{payload['cid']}.token").write_text(token)

    print("Certificate ID :", payload["cid"])
    print("Module         :", payload["m"])
    print("Score          :", payload["s"])
    print("Valid until    :", payload["exp"])
    print("QR image       :", qr_path)
    print("Token          :", token)


if __name__ == "__main__":
    main()
