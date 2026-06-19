// Server-side email validation that catches fake/disposable/test emails
// WITHOUT requiring an external service.
//
// What this catches:
//   ✓ Syntactically malformed emails
//   ✓ Reserved test domains (example.com, test.com, foo.com, ...)
//   ✓ Disposable email providers (Mailinator, 10minutemail, Guerrilla, ...)
//   ✓ Domains with no MX records (typos, made-up domains)
//   ✓ Domains that just don't resolve at all
//
// What this CANNOT catch (would need full email verification + SMTP):
//   ✗ Random unused addresses on real domains (e.g. someone@gmail.com that
//     happens to not exist — gmail's MX accepts all, the mailbox bounces later)
//
// To catch that final ~10%, set up Resend SMTP and re-enable Supabase's
// email confirmation toggle. See README "Production Email" section.

import { promises as dns } from "node:dns";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Reserved-for-documentation/test domains (RFC 2606 + common conventions).
// Always reject — these can never receive real email.
const RESERVED_TEST_DOMAINS = new Set([
  "example.com", "example.org", "example.net",
  "test.com", "test.org", "test.net",
  "invalid", "localhost", "local",
  "foo.com", "bar.com", "baz.com", "qux.com",
  "asdf.com", "asdfasdf.com", "asd.com",
  "abc.com", "xyz.com", "fake.com", "dummy.com",
  "mail.com", "email.com",  // these are generic + heavily abused
]);

// Curated set of disposable / throwaway email providers.
// Source: combined from disposable-email-domains lists + frequent abusers.
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "mailinator.net", "mailinator.org",
  "10minutemail.com", "10minutemail.net",
  "guerrillamail.com", "guerrillamail.net", "guerrillamail.org",
  "guerrillamail.biz", "guerrillamail.de",
  "tempmail.com", "tempmail.dev", "tempmail.email", "tempmail.org",
  "temp-mail.org", "temp-mail.io",
  "throwawaymail.com", "throwaway.email",
  "trashmail.com", "trashmail.net", "trashmail.org",
  "yopmail.com", "yopmail.net", "yopmail.fr",
  "getnada.com", "nada.email", "nada.ltd",
  "fakeinbox.com", "fake-mail.org",
  "spamgourmet.com", "spam4.me",
  "mintemail.com", "maildrop.cc",
  "dispostable.com", "discard.email", "discardmail.com",
  "harakirimail.com", "mytrashmail.com",
  "tempinbox.com", "tempr.email",
  "moakt.cc", "moakt.com", "moakt.ws",
  "sharklasers.com", "grr.la",
  "trbvm.com", "boximail.com",
  "mail-temp.com", "mail-temporaire.fr",
  "emailondeck.com", "fakemail.net", "fakemailgenerator.com",
  "anonbox.net", "mvrht.net",
  "burnermail.io", "burnermail.com",
  "tafmail.com", "tmail.com", "tmail.ws",
  "0815.ru", "0wnd.net", "0wnd.org",
  "33mail.com", "10mail.org",
  "drdrb.net", "duck2.club",
  "emailtemporanea.com", "emailtemporanea.net",
  "incognitomail.com", "incognitomail.net",
  "instant-mail.de", "jourrapide.com",
  "klzlk.com", "kurzepost.de",
  "lroid.com", "letthemeatspam.com",
  "mailcatch.com", "mailexpire.com",
  "mailmoat.com", "mailnesia.com",
  "mailnull.com", "mailtothis.com",
  "mailzilla.com", "mailzilla.org",
  "meltmail.com", "mintemail.com",
  "mt2009.com", "mytemp.email",
  "nomail.xl.cx", "nospam.ze.tc",
  "objectmail.com", "obobbo.com",
  "rcpt.at", "recode.me",
  "rmqkr.net", "safe-mail.net",
  "selfdestructingmail.com", "sendspamhere.com",
  "shitmail.me", "shortmail.net",
  "sneakemail.com", "snkmail.com",
  "sofort-mail.de", "sogetthis.com",
  "spam.la", "spamavert.com",
  "spambob.net", "spambog.com",
  "spambox.us", "spamcero.com",
  "spamfree24.org", "spamhole.com",
  "spammotel.com", "spamspot.com",
  "speed.1s.fr", "stinkefinger.net",
  "sweetxxx.de", "tafoi.gr",
  "teleworm.us", "tempemail.biz",
  "tempymail.com", "tempymail.ml",
  "thanksnospam.info", "trash2009.com",
  "trash-mail.at", "trashymail.com",
  "tyldd.com", "umail.net",
  "uroid.com", "veryrealemail.com",
  "wegwerfemail.de", "wegwerfemail.net",
  "weg-werf-email.de", "wh4f.org",
  "whyspam.me", "willhackforfood.biz",
  "wronghead.com", "wuzup.net",
  "xost.us", "youmailr.com",
  "ypmail.webarnak.fr.eu.org", "zoaxe.com",
  "zoemail.org",
  // common typo/test patterns
  "gnail.com", "gmial.com", "hotnail.com", "yahho.com",
]);

// Domains with no working MX records typically. Cache results in-process
// to avoid hammering DNS for repeat signups.
const mxCache = new Map(); // domain -> { ok: boolean, at: number }
const MX_CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function hasMxRecord(domain) {
  const now = Date.now();
  const cached = mxCache.get(domain);
  if (cached && now - cached.at < MX_CACHE_TTL) return cached.ok;
  try {
    const records = await dns.resolveMx(domain);
    const ok = Array.isArray(records) && records.length > 0;
    mxCache.set(domain, { ok, at: now });
    return ok;
  } catch (e) {
    // ENOTFOUND, ENODATA, etc.
    mxCache.set(domain, { ok: false, at: now });
    return false;
  }
}

/**
 * Validate an email address. Returns { ok: boolean, reason?: string }.
 * On `ok: false`, `reason` is a user-facing message.
 */
export async function validateEmail(rawEmail) {
  const email = String(rawEmail || "").trim().toLowerCase();

  if (!EMAIL_RE.test(email)) {
    return { ok: false, reason: "That's not a valid email address." };
  }
  const [, domain] = email.split("@");
  if (!domain || domain.length < 4) {
    return { ok: false, reason: "Email domain looks invalid." };
  }

  if (RESERVED_TEST_DOMAINS.has(domain)) {
    return { ok: false, reason: `${domain} is a test domain that can't receive mail. Use your real email.` };
  }

  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { ok: false, reason: "Disposable email addresses aren't allowed. Use a permanent email." };
  }

  const mxOk = await hasMxRecord(domain);
  if (!mxOk) {
    return {
      ok: false,
      reason: `We couldn't verify ${domain} actually receives email. Check for typos.`,
    };
  }

  return { ok: true };
}
