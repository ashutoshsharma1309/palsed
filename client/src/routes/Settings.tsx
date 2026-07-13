import { useState } from "react";
import toast from "react-hot-toast";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { LS_KEYS, useLocalStorageState } from "../hooks/useLocalStorageState";
import type { Profile } from "../types/profile";

const DEFAULT_PROFILE: Profile = {
  displayName: "Learner",
  avatarSeed: "default",
  joinedAt: new Date().toISOString(),
  learningGoal: "Master DSA",
  preferredStyle: "step_by_step",
  dailyMinutes: 30,
};

export default function Settings() {
  const [profile, setProfile] = useLocalStorageState<Profile>(LS_KEYS.profile, DEFAULT_PROFILE);
  const [confirming, setConfirming] = useState(false);

  const exportData = () => {
    const blob: Record<string, unknown> = {};
    Object.values(LS_KEYS).forEach((k) => {
      const raw = localStorage.getItem(k);
      if (raw !== null) blob[k] = JSON.parse(raw);
    });
    const data = new Blob([JSON.stringify(blob, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prepnext-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported your data");
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        Object.entries(parsed).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)));
        toast.success("Imported. Reloading…");
        setTimeout(() => location.reload(), 600);
      } catch (err) {
        toast.error("Couldn't parse that file");
      }
    };
    reader.readAsText(file);
  };

  const wipe = () => {
    Object.values(LS_KEYS).forEach((k) => localStorage.removeItem(k));
    toast.success("Wiped. Reloading…");
    setTimeout(() => location.reload(), 600);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">// settings</div>
      <h1 className="display text-5xl sm:text-7xl mb-10">YOUR DATA, YOUR CALL.</h1>

      <Card className="mb-6">
        <h2 className="display text-2xl mb-4">PROFILE.</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Display name">
            <input
              className="w-full bg-transparent border-b border-[var(--color-line)] focus:border-[var(--color-neon)] outline-none py-2"
              value={profile.displayName}
              onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
            />
          </Field>
          <Field label="Daily minutes">
            <input
              type="number"
              min={5}
              max={240}
              className="w-full bg-[#1a1a1a] border border-[var(--color-line)] rounded p-2"
              value={profile.dailyMinutes}
              onChange={(e) => setProfile({ ...profile, dailyMinutes: +e.target.value })}
            />
          </Field>
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="display text-2xl mb-4">EXPORT / IMPORT.</h2>
        <p className="text-sm text-[var(--color-text-faint)] mb-4">
          Export your learning data as a backup, or import it on another device.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={exportData}>Export JSON</Button>
          <label className="inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-150 px-5 py-2.5 text-sm bg-transparent text-[var(--color-neon)] border border-[var(--color-neon)]/60 hover:bg-[var(--color-neon)]/10 cursor-pointer">
            Import JSON
            <input type="file" accept="application/json" className="hidden" onChange={importData} />
          </label>
        </div>
      </Card>

      <Card>
        <h2 className="display text-2xl mb-4">WIPE EVERYTHING.</h2>
        <p className="text-sm text-[var(--color-text-faint)] mb-4">
          Removes your profile, courses, mastery, SRS — everything PrepNext has saved on this browser.
          No undo.
        </p>
        {confirming ? (
          <div className="flex gap-3">
            <Button variant="danger" onClick={wipe}>Yes, wipe</Button>
            <Button variant="ghost" onClick={() => setConfirming(false)}>Cancel</Button>
          </div>
        ) : (
          <Button variant="danger" onClick={() => setConfirming(true)}>Wipe my data</Button>
        )}
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mono mb-1">{label}</div>
      {children}
    </label>
  );
}
