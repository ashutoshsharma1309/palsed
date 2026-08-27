import { useEffect } from "react";

interface PageMeta {
  title: string;
  description?: string;
  // Canonical path WITHOUT origin — origin gets stamped from window.location at runtime.
  canonical?: string;
}

const BRAND = "PrepNext";
const DEFAULT_DESCRIPTION =
  "Crack campus placements: 85 recruiters mapped, crowd-verified PYQs, DSA + Core CS prep, coding patterns, project paths, and a single Placement Readiness Score. Built for Indian engineering students.";

function setMetaContent(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Per-route document head updater. Sets <title>, meta description, OG/Twitter
 * mirrors, and canonical link. Tiny + dependency-free — no react-helmet needed.
 *
 * Pass `title` without the brand suffix; we append " — PrepNext" automatically.
 */
export function usePageMeta({ title, description, canonical }: PageMeta) {
  useEffect(() => {
    const fullTitle = `${title} — ${BRAND}`;
    const desc = description || DEFAULT_DESCRIPTION;
    const origin = typeof window !== "undefined" ? window.location.origin : "https://prepnext.vercel.app";
    const url = canonical ? `${origin}${canonical}` : (typeof window !== "undefined" ? window.location.href : origin);

    document.title = fullTitle;
    setMetaContent("description", desc);
    setMetaContent("og:title", fullTitle, "property");
    setMetaContent("og:description", desc, "property");
    setMetaContent("og:url", url, "property");
    setMetaContent("twitter:title", fullTitle);
    setMetaContent("twitter:description", desc);
    setCanonical(url);
  }, [title, description, canonical]);
}
