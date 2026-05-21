import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  displayName: string;
  score: number;
  issuedAt: string;
  verifyCode: string;
}

async function sha256Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function base64url(s: string): string {
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function issueCertificate({
  courseId,
  courseTitle,
  displayName,
  score,
}: {
  courseId: string;
  courseTitle: string;
  displayName: string;
  score: number;
}): Promise<Certificate> {
  const issuedAt = new Date().toISOString();
  const salt = "palsed.v1";
  const hash = await sha256Hex(courseId + displayName + issuedAt + salt);
  const verifyCode = base64url(hash).slice(0, 12);
  const id = `cert_${Date.now().toString(36)}`;
  return { id, courseId, courseTitle, displayName, score, issuedAt, verifyCode };
}

export function buildVerifyUrl(cert: Certificate): string {
  const payload = {
    courseTitle: cert.courseTitle,
    displayName: cert.displayName,
    score: cert.score,
    issuedAt: cert.issuedAt,
    verifyCode: cert.verifyCode,
  };
  const enc = base64url(JSON.stringify(payload));
  return `${location.origin}/verify-certificate?id=${cert.verifyCode}#${enc}`;
}

export function parseVerifyHash(): Certificate | null {
  try {
    const hash = location.hash.replace(/^#/, "");
    if (!hash) return null;
    const padded = hash.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(padded);
    const p = JSON.parse(json);
    return { id: p.verifyCode, courseId: "", ...p };
  } catch {
    return null;
  }
}

export async function downloadCertificatePdf(node: HTMLElement, filename: string) {
  const canvas = await html2canvas(node, { backgroundColor: "#0a0a0a", scale: 2 });
  const img = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width, canvas.height] });
  pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save(filename);
}

export async function qrDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    width: 200,
    margin: 1,
    color: { dark: "#0a0a0a", light: "#ffffffff" },
  });
}
