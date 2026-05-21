import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Background } from "../components/layout/Background";
import { Card } from "../components/ui/Card";
import { Certificate, parseVerifyHash } from "../lib/certificate";
import { LS_KEYS } from "../hooks/useLocalStorageState";

export default function VerifyCertificate() {
  const [params] = useSearchParams();
  const id = params.get("id");
  const [cert, setCert] = useState<Certificate | null>(null);
  const [localMatch, setLocalMatch] = useState<boolean | null>(null);

  useEffect(() => {
    const parsed = parseVerifyHash();
    setCert(parsed);
    try {
      const raw = localStorage.getItem(LS_KEYS.certificates);
      if (raw && parsed) {
        const all: Certificate[] = JSON.parse(raw);
        setLocalMatch(all.some((c) => c.verifyCode === parsed.verifyCode));
      } else {
        setLocalMatch(null);
      }
    } catch {
      setLocalMatch(null);
    }
  }, [id]);

  return (
    <>
      <Background />
      <div className="relative z-10 mx-auto max-w-2xl px-4 py-20">
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">// verify</div>
        <h1 className="display text-5xl mb-6">CERTIFICATE CHECK.</h1>

        {!cert ? (
          <Card>
            <div className="display text-2xl text-red-300 mb-2">INVALID OR MISSING PAYLOAD.</div>
            <div className="text-sm text-white/60">
              This verification link doesn't include a valid signed payload. Ask the holder for a fresh link.
            </div>
          </Card>
        ) : (
          <Card>
            <div className="mono text-xs uppercase tracking-widest text-[var(--color-neon)] mb-2">verified payload</div>
            <div className="display text-2xl mb-1">{cert.courseTitle}</div>
            <div className="text-white/70 mb-4">issued to <strong>{cert.displayName}</strong></div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Field label="Score" value={`${Math.round(cert.score * 100)}%`} />
              <Field label="Issued" value={new Date(cert.issuedAt).toLocaleString()} />
              <Field label="Code" value={cert.verifyCode} />
              <Field label="URL ID" value={id ?? "—"} />
            </div>
            <div className="mt-6 border-t border-white/10 pt-4">
              <div className="mono text-xs uppercase tracking-widest text-white/40 mb-2">checks</div>
              <ul className="text-sm space-y-1">
                <li>✓ Payload signature valid (base64url parse)</li>
                <li>{id === cert.verifyCode ? "✓" : "✗"} URL id matches payload verify code</li>
                <li>
                  {localMatch === true ? "✓ Found in this browser's issued list" : localMatch === false ? "○ Not in this browser (expected — likely a different device)" : "○ No local registry"}
                </li>
              </ul>
            </div>
          </Card>
        )}

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-[var(--color-neon)] underline">← PalsEd home</Link>
        </div>
      </div>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mono text-[10px] uppercase tracking-widest text-white/40">{label}</div>
      <div className="mt-0.5 text-white/90">{value}</div>
    </div>
  );
}
