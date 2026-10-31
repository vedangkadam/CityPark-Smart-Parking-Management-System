import { useState, useEffect, useCallback } from "react";

const ENABLED_KEY = "cp_biometric_enabled";
const CRED_KEY = "cp_biometric_cred";

function b64urlToBuf(b64) {
  const pad = b64.length % 4 ? "=".repeat(4 - (b64.length % 4)) : "";
  const s = b64.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const raw = atob(s);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

/**
 * Biometric (fingerprint / face) lock using the WebAuthn platform
 * authenticator. On mobile this triggers the device's native biometric
 * prompt. Registration stores a local credential id; verification re-prompts
 * the user. Used as a client-side "double security" gate on app open.
 */
export function useBiometric() {
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(
    () => localStorage.getItem(ENABLED_KEY) === "1"
  );

  useEffect(() => {
    if (window.PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable) {
      window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then(
        setSupported
      );
    }
  }, []);

  const register = useCallback(async () => {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);
    const userId = new Uint8Array(16);
    crypto.getRandomValues(userId);
    const cred = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: "CityPark" },
        user: {
          id: userId,
          name: "citypark-biometric",
          displayName: "CityPark Biometric",
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },
          { type: "public-key", alg: -257 },
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          residentKey: "preferred",
        },
        timeout: 60000,
      },
    });
    localStorage.setItem(CRED_KEY, cred.id);
    localStorage.setItem(ENABLED_KEY, "1");
    setEnabled(true);
    return true;
  }, []);

  const verify = useCallback(async () => {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);
    const credId = localStorage.getItem(CRED_KEY);
    const allow = credId
      ? [{ type: "public-key", id: b64urlToBuf(credId) }]
      : [];
    await navigator.credentials.get({
      publicKey: {
        challenge,
        timeout: 60000,
        userVerification: "required",
        allowCredentials: allow,
      },
    });
    return true;
  }, []);

  const disable = useCallback(() => {
    localStorage.removeItem(ENABLED_KEY);
    localStorage.removeItem(CRED_KEY);
    setEnabled(false);
  }, []);

  return { supported, enabled, register, verify, disable };
}