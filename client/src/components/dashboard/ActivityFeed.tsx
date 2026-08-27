import { useEffect, useState } from "react";

export interface ActivityEvent {
  id: string;
  type: string;
  userId: string;
  at: string; // ISO timestamp
}

export interface FeedUser {
  id: string;
  name: string;
}

interface Props {
  events: ActivityEvent[];
  users: FeedUser[];
}

// Live "recent activity" feed for the dashboard.
export function ActivityFeed({ events, users }: Props) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setInterval(() => setNow(Date.now()), 1000);
  }, []);

  const sorted = [...events].sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
  );

  return (
    <ul className="space-y-1 text-xs">
      {sorted.map((e) => {
        const user = users.find((u) => u.id === e.userId);
        const secondsAgo = Math.floor((now - new Date(e.at).getTime()) / 1000);
        return (
          <li key={e.type} className="flex justify-between">
            <span className="text-[var(--color-text-dim)]">
              {user?.name ?? "Someone"} · {e.type}
            </span>
            <span className="mono text-[var(--color-text-faint)]">{secondsAgo}s ago</span>
          </li>
        );
      })}
    </ul>
  );
}
