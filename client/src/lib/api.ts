let _apiUrl: string = __API_URL__;
let _refreshedOnce = false;

export function getApiUrl() {
  return _apiUrl;
}

/** Refresh API URL from /runtime-config.json (so if user restarts server, client picks new port). */
export async function refreshApiUrl(): Promise<string> {
  try {
    const r = await fetch("/runtime-config.json", { cache: "no-store" });
    if (r.ok) {
      const j = await r.json();
      if (j?.apiUrl && typeof j.apiUrl === "string") {
        _apiUrl = j.apiUrl;
      }
    }
  } catch {
    // ignore — fallback to build-time value
  }
  _refreshedOnce = true;
  return _apiUrl;
}

async function ensureFresh() {
  if (!_refreshedOnce) await refreshApiUrl();
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  await ensureFresh();
  const r = await fetch(`${_apiUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    let detail: any = null;
    try {
      detail = await r.json();
    } catch {}
    const err: any = new Error(detail?.error || `HTTP ${r.status}`);
    err.status = r.status;
    err.detail = detail;
    throw err;
  }
  return r.json();
}

export async function apiGet<T>(path: string): Promise<T> {
  await ensureFresh();
  const r = await fetch(`${_apiUrl}${path}`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}
