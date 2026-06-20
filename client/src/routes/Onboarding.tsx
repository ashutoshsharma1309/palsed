import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2, GraduationCap, School, BookOpen, Briefcase, Hash, Phone, Linkedin, Github, ArrowRight, AlertTriangle } from "lucide-react";
import { Background } from "../components/layout/Background";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Chip } from "../components/ui/Chip";
import { useAuth } from "../hooks/useAuth";
import { saveProfile } from "../lib/auth";
import { usePageMeta } from "../hooks/usePageMeta";

// Profile-setup screen — shown right after Google sign-in for users whose
// profileComplete=false. Until they submit a valid form, AuthCallback bounces
// them back here.
//
// Hard-required: full name, college, branch, year of study, graduation year.
// Soft (optional but encouraged): CGPA, phone, LinkedIn, GitHub, target roles.

const BRANCHES = ["CSE", "IT", "ECE", "EE", "EEE", "ME", "Civil", "Chemical", "Biotech", "MCA", "MBA", "Other"] as const;
const YEARS = [1, 2, 3, 4, 5] as const;
const ROLES = ["SDE", "Data", "ML", "Product", "Design", "DevOps", "Security", "Consulting", "Finance", "Quant"] as const;

const inputCls =
  "w-full mt-1 bg-[var(--color-input)] border border-[var(--color-line)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] outline-none focus:border-[var(--color-neon)] focus:bg-[var(--color-input-strong)] transition-colors";
const labelCls = "text-[11px] uppercase tracking-widest text-[var(--color-text-faint)] mono flex items-center gap-1.5";

export default function Onboarding() {
  usePageMeta({
    title: "Set up your profile",
    description: "Quick profile so PrepNext can tailor recruiters + prep to your branch, year, and CGPA.",
    canonical: "/onboarding",
  });

  const navigate = useNavigate();
  const { user, loading, refetch } = useAuth();

  // If already complete, send them home — they shouldn't be here.
  useEffect(() => {
    if (!loading && user?.profileComplete) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, user, navigate]);

  const thisYear = new Date().getFullYear();
  const gradYears = useMemo(
    () => Array.from({ length: 6 }, (_, i) => thisYear - 1 + i),
    [thisYear]
  );

  // Pre-fill with anything we already know about the user.
  const [fullName, setFullName] = useState(user?.fullName || user?.displayName || "");
  const [collegeName, setCollegeName] = useState(user?.collegeName || "");
  const [branch, setBranch] = useState<string>(user?.branch || "");
  const [yearOfStudy, setYearOfStudy] = useState<number | null>(user?.yearOfStudy ?? null);
  const [graduationYear, setGraduationYear] = useState<number | null>(user?.graduationYear ?? null);
  const [cgpa, setCgpa] = useState<string>(user?.cgpa != null ? String(user.cgpa) : "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || "");
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || "");
  const [targetRoles, setTargetRoles] = useState<string[]>(user?.targetRoles || []);

  // Re-hydrate when user fetches in (initial render may have no user yet).
  useEffect(() => {
    if (!user) return;
    if (!fullName && (user.fullName || user.displayName)) setFullName(user.fullName || user.displayName);
    if (!collegeName && user.collegeName) setCollegeName(user.collegeName);
    if (!branch && user.branch) setBranch(user.branch);
    if (yearOfStudy === null && user.yearOfStudy) setYearOfStudy(user.yearOfStudy);
    if (graduationYear === null && user.graduationYear) setGraduationYear(user.graduationYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleRole = (r: string) => {
    setTargetRoles((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : prev.length >= 5 ? prev : [...prev, r]
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = fullName.trim();
    const trimmedCollege = collegeName.trim();
    const parsedCgpa = cgpa.trim() === "" ? null : Number(cgpa);

    if (trimmedName.length < 2) return setError("Enter your full name.");
    if (trimmedCollege.length < 2) return setError("Enter your college name.");
    if (!branch) return setError("Pick your branch.");
    if (!yearOfStudy) return setError("Pick your year of study.");
    if (!graduationYear) return setError("Pick your expected graduation year.");
    if (parsedCgpa !== null && (Number.isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 10)) {
      return setError("CGPA must be a number between 0 and 10.");
    }

    setBusy(true);
    try {
      await saveProfile({
        fullName: trimmedName,
        collegeName: trimmedCollege,
        branch,
        yearOfStudy,
        graduationYear,
        cgpa: parsedCgpa,
        phoneNumber: phoneNumber.trim() || undefined,
        linkedinUrl: linkedinUrl.trim() || undefined,
        githubUrl: githubUrl.trim() || undefined,
        targetRoles,
      });
      await refetch?.();
      toast.success("Profile saved!");
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err?.message || "Couldn't save profile.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <>
        <Background />
        <div className="relative z-10 min-h-screen grid place-items-center">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--color-neon)]" />
        </div>
      </>
    );
  }

  return (
    <>
      <Background />
      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 py-10 min-h-screen">
        <header className="mb-8">
          <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">
            · welcome to PrepNext ·
          </div>
          <h1 className="display text-4xl sm:text-5xl leading-[0.95]">
            Quick profile.
          </h1>
          <p className="text-[var(--color-text-dim)] mt-3 max-w-xl">
            30 seconds. We use this to tailor recruiter eligibility, suggest the right DSA topics,
            and personalise your placement timeline. You can edit any of this later in Settings.
          </p>
        </header>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* IDENTITY */}
          <Card>
            <h2 className="display text-xl mb-4">Identity.</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls} htmlFor="fullName">
                  Full Name <span className="text-[var(--color-neon)]">*</span>
                </label>
                <input
                  id="fullName"
                  className={inputCls}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Aarav Sharma"
                  autoComplete="name"
                  maxLength={120}
                  required
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="email">Email</label>
                <input
                  id="email"
                  className={`${inputCls} opacity-70`}
                  value={user?.email || ""}
                  disabled
                />
                <div className="text-[10px] text-[var(--color-text-faint)] mt-1">From Google.</div>
              </div>
            </div>
          </Card>

          {/* COLLEGE */}
          <Card>
            <h2 className="display text-xl mb-4">College.</h2>
            <div className="space-y-4">
              <div>
                <label className={labelCls} htmlFor="collegeName">
                  <School className="w-3 h-3" /> College Name <span className="text-[var(--color-neon)]">*</span>
                </label>
                <input
                  id="collegeName"
                  className={inputCls}
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="IIT Bombay / VIT Vellore / SRM Chennai…"
                  maxLength={200}
                  required
                />
              </div>

              <div>
                <label className={labelCls}>
                  <BookOpen className="w-3 h-3" /> Branch <span className="text-[var(--color-neon)]">*</span>
                </label>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {BRANCHES.map((b) => (
                    <Chip key={b} active={branch === b} onClick={() => setBranch(b)}>
                      {b}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>
                    <GraduationCap className="w-3 h-3" /> Year of Study <span className="text-[var(--color-neon)]">*</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {YEARS.map((y) => (
                      <Chip tone="neon" key={y} active={yearOfStudy === y} onClick={() => setYearOfStudy(y)}>
                        {y}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelCls} htmlFor="gradYear">
                    Grad Year <span className="text-[var(--color-neon)]">*</span>
                  </label>
                  <select
                    id="gradYear"
                    className={inputCls}
                    value={graduationYear ?? ""}
                    onChange={(e) => setGraduationYear(e.target.value ? Number(e.target.value) : null)}
                    required
                  >
                    <option value="">— Select —</option>
                    {gradYears.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls} htmlFor="cgpa">
                    <Hash className="w-3 h-3" /> CGPA <span className="text-[var(--color-text-faint)]">(/10)</span>
                  </label>
                  <input
                    id="cgpa"
                    type="number"
                    step={0.01}
                    min={0}
                    max={10}
                    className={inputCls}
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    placeholder="8.5"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* TARGET ROLES */}
          <Card>
            <h2 className="display text-xl mb-1">Target roles.</h2>
            <p className="text-[var(--color-text-faint)] text-xs mb-4">
              Pick up to 5. Helps us prioritise the right companies + DSA topics.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ROLES.map((r) => (
                <Chip
                  tone="neon"
                  key={r}
                  active={targetRoles.includes(r)}
                  onClick={() => toggleRole(r)}
                >
                  <Briefcase className="w-3 h-3" /> {r}
                </Chip>
              ))}
            </div>
            {targetRoles.length > 0 && (
              <p className="text-[10px] text-[var(--color-text-faint)] mt-2">
                {targetRoles.length} / 5 selected
              </p>
            )}
          </Card>

          {/* CONTACT (optional) */}
          <Card>
            <h2 className="display text-xl mb-1">Links <span className="text-[var(--color-text-faint)] text-xs">(optional)</span></h2>
            <p className="text-[var(--color-text-faint)] text-xs mb-4">
              Add these now so recruiters scanning your profile see proof of work.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls} htmlFor="phone">
                  <Phone className="w-3 h-3" /> Phone
                </label>
                <input
                  id="phone"
                  className={inputCls}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91-9XXXXXXXXX"
                  autoComplete="tel"
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="linkedin">
                  <Linkedin className="w-3 h-3" /> LinkedIn
                </label>
                <input
                  id="linkedin"
                  className={inputCls}
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="linkedin.com/in/yourhandle"
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="github">
                  <Github className="w-3 h-3" /> GitHub
                </label>
                <input
                  id="github"
                  className={inputCls}
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="github.com/yourhandle"
                />
              </div>
            </div>
          </Card>

          {error && (
            <div className="flex items-start gap-2 text-[#ff5247] text-sm bg-[#ff5247]/10 border border-[#ff5247]/30 rounded-xl px-3 py-2" role="alert">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-[var(--color-text-faint)]">
              Fields marked <span className="text-[var(--color-neon)]">*</span> are required.
            </p>
            <Button type="submit" disabled={busy} size="lg">
              {busy ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  Finish setup <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
