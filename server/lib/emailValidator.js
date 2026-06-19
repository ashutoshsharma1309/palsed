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

// Common test local-parts that nobody uses for real signup.
const SUSPICIOUS_LOCAL_PARTS = new Set([
  "test", "tester", "testing", "test1", "test2", "test123",
  "admin", "administrator", "root", "user", "demo", "sample",
  "fake", "fake1", "fake2", "noone", "nobody", "anonymous", "anon",
  "noreply", "no-reply", "donotreply", "do-not-reply",
  "abc", "abc123", "abcd", "abcde", "abcdef", "abcdefg",
  "xyz", "xyz123", "qwerty", "qwerty123", "password", "password123",
  "asdf", "asdfg", "asdfgh", "asdfghjkl",
  "qwer", "qwertyuiop", "zxcv", "zxcvbn", "zxcvbnm",
  "aaa", "bbb", "ccc", "ddd",
  "example", "sample", "dummy", "delete", "deleteme",
]);

// Detect "keyboard mash" style local parts — random gibberish typed during
// signup tests. Catches stuff like `adadadada`, `asdfgh`, `xyxyxyxy`.
function looksLikeGibberish(local) {
  if (local.length < 2) return true;
  // Very short (1-2 chars) is allowed via the length check in validateEmail.
  // Most "real but short" emails are initials like "ab", "jp", "kp".
  if (local.length === 2) return false;

  // Single LETTER repeated 3+ times anywhere → "aaa", "iiiiiii"
  // (Digits intentionally allowed: years/phones often contain runs like "888".)
  if (/([a-z])\1{2,}/i.test(local)) return true;

  // 2-3 char unit repeated 3+ times → "adadada", "xyxyxy", "abcabcabc"
  if (/^(.{2,3})\1{2,}$/.test(local)) return true;

  // Whole local part is one half repeated → "asdfasdf", "abcabc", "fooFoo".
  if (local.length >= 6 && local.length % 2 === 0) {
    const half = local.length / 2;
    if (local.slice(0, half).toLowerCase() === local.slice(half).toLowerCase()) return true;
  }

  // 2-char unit repeated covering ≥80% of length → "adadadab", "xyxyxz"
  for (let unit = 2; unit <= 3; unit++) {
    if (local.length >= unit * 3) {
      const head = local.slice(0, unit);
      let repeats = 0;
      for (let i = 0; i + unit <= local.length; i += unit) {
        if (local.slice(i, i + unit) === head) repeats++;
        else break;
      }
      if (repeats * unit >= local.length * 0.8) return true;
    }
  }

  // Known keyboard rows / common mashing
  const KEYBOARD_PATTERNS = [
    "qwerty", "qwertyuiop", "asdfgh", "asdfghjkl", "zxcvbn", "zxcvbnm",
    "qwer", "asdf", "zxcv", "yuio", "hjkl", "bnm",
    "1234", "12345", "123456", "1234567", "12345678",
    "abcd", "abcde", "abcdef", "abcdefg", "abcdefgh",
    "asdasd", "qweqwe", "zxczxc",
  ];
  for (const p of KEYBOARD_PATTERNS) {
    if (local === p || local.startsWith(p) && local.length <= p.length + 3) return true;
  }

  // Very low vowel ratio for length ≥ 5 → likely mashing
  // e.g. "kjlsdfhg" has 0 vowels, "asdfgh" has 1/6
  if (local.length >= 5) {
    const vowels = (local.match(/[aeiouy]/gi) || []).length;
    const ratio = vowels / local.length;
    if (ratio < 0.1) return true;
  }

  // All same single letter — "aaaa", "bbbbb"
  // (Don't reject 2-unique-letter patterns — would kill real names like
  // anna, mama, papa, yoyo, didi, coco, kiki, etc.)
  if (/^([a-z])\1+$/i.test(local)) return true;

  // Pure digits — e.g. "12345" (real users always have at least one letter).
  if (/^\d+$/.test(local)) return true;

  return false;
}

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
  const [local, domain] = email.split("@");
  if (!domain || domain.length < 4) {
    return { ok: false, reason: "Email domain looks invalid." };
  }
  if (!local || local.length < 2) {
    return { ok: false, reason: "Use your real email address (the local part is too short)." };
  }

  if (SUSPICIOUS_LOCAL_PARTS.has(local)) {
    return { ok: false, reason: "Use your real email address — not a generic placeholder." };
  }
  if (looksLikeGibberish(local)) {
    return { ok: false, reason: "That email looks fake. Please use your real address." };
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
