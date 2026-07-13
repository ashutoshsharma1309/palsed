import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocalStorageState, LS_KEYS } from "../hooks/useLocalStorageState";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { buildVerifyUrl, Certificate, downloadCertificatePdf, qrDataUrl } from "../lib/certificate";

export default function Certificates() {
  const [certs] = useLocalStorageState<Certificate[]>(LS_KEYS.certificates, []);
  const [selected, setSelected] = useState<Certificate | null>(certs[0] ?? null);

  // Auto-select the first cert once the list resolves (it can start empty while
  // the per-user storage key settles), and clear a stale selection.
  useEffect(() => {
    if (!certs.length) return;
    if (!selected || !certs.some((c) => c.id === selected.id)) setSelected(certs[0]);
  }, [certs, selected]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">// certificates</div>
      <h1 className="display text-5xl sm:text-7xl mb-8">CERTIFICATES.</h1>

      {certs.length === 0 ? (
        <Card className="text-center py-20">
          <div className="display text-3xl mb-3">NO CERTIFICATES YET.</div>
          <div className="text-[var(--color-text-faint)]">Pass a course quiz at or above its passing score to earn one.</div>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-[300px_1fr] gap-5">
          <div className="space-y-2">
            {certs.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className={`w-full text-left p-4 rounded-xl border ${
                  selected?.id === c.id ? "border-[var(--color-neon)] bg-[var(--color-neon)]/10" : "border-[var(--color-line)]"
                }`}
              >
                <div className="font-semibold text-sm">{c.courseTitle}</div>
                <div className="mono text-xs text-[var(--color-text-faint)] mt-1">
                  {Math.round(c.score * 100)}% · {new Date(c.issuedAt).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
          {selected && <CertificateView cert={selected} />}
        </div>
      )}
    </div>
  );
}

function CertificateView({ cert }: { cert: Certificate }) {
  const ref = useRef<HTMLDivElement>(null);
  const [qr, setQr] = useState<string>("");
  const url = buildVerifyUrl(cert);

  useEffect(() => {
    qrDataUrl(url).then(setQr);
  }, [url]);

  return (
    <div>
      <div
        ref={ref}
        className="bg-[#0a0a0a] border-2 border-[var(--color-neon)] rounded-3xl p-10 relative overflow-hidden"
        style={{ aspectRatio: "1.414/1" }}
      >
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative">
          <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-4">
            // certificate of completion
          </div>
          <div className="display text-3xl sm:text-5xl mb-8 leading-tight">PREPNEXT</div>
          <div className="text-sm text-[var(--color-text-faint)] mb-2">This is to certify that</div>
          <div className="display text-4xl mb-8">{cert.displayName}</div>
          <div className="text-sm text-[var(--color-text-faint)] mb-2">has successfully completed</div>
          <div className="display text-3xl mb-8 text-[var(--color-neon)]">{cert.courseTitle}</div>
          <div className="flex justify-between items-end gap-6 flex-wrap">
            <div>
              <div className="mono text-xs text-[var(--color-text-faint)]">issued</div>
              <div className="text-sm">{new Date(cert.issuedAt).toLocaleDateString()}</div>
              <div className="mono text-xs text-[var(--color-text-faint)] mt-3">score</div>
              <div className="display text-2xl">{Math.round(cert.score * 100)}%</div>
              <div className="mono text-xs text-[var(--color-text-faint)] mt-3">verify code</div>
              <div className="mono text-sm text-[var(--color-neon)]">{cert.verifyCode}</div>
            </div>
            {qr && (
              <div className="text-right">
                <img src={qr} alt="verify" className="w-32 h-32 rounded-lg border border-[var(--color-line)]" />
                <div className="mono text-[10px] text-[var(--color-text-faint)] mt-2">scan to verify</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-4 flex-wrap">
        <Button onClick={() => ref.current && downloadCertificatePdf(ref.current, `prepnext-${cert.verifyCode}.pdf`)}>
          Download PDF
        </Button>
        <Button variant="outline" onClick={() => {
          navigator.clipboard?.writeText(url)
            .then(() => toast.success("Verify URL copied"))
            .catch(() => toast.error("Couldn't copy — long-press to copy manually"));
        }}>
          Copy verify URL
        </Button>
      </div>
    </div>
  );
}
