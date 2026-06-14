import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, GraduationCap, Target, Layers, Bookmark } from "lucide-react";
import { Card } from "../components/ui/Card";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Donut } from "../components/ui/Donut";
import { HubSectionView } from "../components/placement/HubSectionView";
import { TopicCard } from "../components/placement/TopicCard";
import { usePlacementProgress } from "../hooks/usePlacementProgress";
import { SECTIONS, searchTopics, getTopic } from "../data/placement";

export default function PlacementHub() {
  const {
    isComplete, toggleComplete, isBookmarked, toggleBookmark,
    completedCount, completionPct, readinessScore, totalTopics, bookmarks,
  } = usePlacementProgress();

  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const hits = searchTopics(query);
    return hits
      .map((h) => getTopic(h.topicId))
      .filter((x): x is NonNullable<typeof x> => Boolean(x));
  }, [query]);

  const searching = query.trim().length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      {/* Header */}
      <header className="mb-8">
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-3">
          · centralized placement prep ·
        </div>
        <h1 className="display text-5xl sm:text-7xl">PLACEMENT TRAINING HUB.</h1>
        <p className="text-white/60 max-w-2xl mt-3 text-lg">
          Everything to crack placements in one place — languages, DSA, LeetCode, web, ML, AI,
          app dev, aptitude, core CS, and interviews. Track progress as you go.
        </p>
      </header>

      {/* Progress summary */}
      <div className="grid lg:grid-cols-3 gap-5 mb-8">
        <Card className="flex items-center gap-5 bg-white/[0.04] backdrop-blur-xl">
          <Donut
            size={92}
            thickness={12}
            showLegend={false}
            centerValue={readinessScore}
            segments={[
              { label: "Ready", value: readinessScore, color: "#c8ff3d" },
              { label: "Remaining", value: Math.max(0, 100 - readinessScore), color: "#1f1f1f" },
            ]}
          />
          <div>
            <div className="mono text-xs uppercase tracking-widest text-white/50">Placement readiness</div>
            <div className="text-white/70 text-sm mt-1">Breadth + depth across all tracks</div>
          </div>
        </Card>
        <Card className="bg-white/[0.04] backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-5 h-5 text-[var(--color-neon)]" aria-hidden="true" />
            <div className="mono text-xs uppercase tracking-widest text-white/50">Topics completed</div>
          </div>
          <div className="display text-5xl">
            {completedCount}<span className="text-white/30 text-2xl">/{totalTopics}</span>
          </div>
          <div className="mt-3"><ProgressBar value={completionPct} /></div>
        </Card>
        <Card className="bg-white/[0.04] backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-3">
            <Bookmark className="w-5 h-5 text-[var(--color-neon)]" aria-hidden="true" />
            <div className="mono text-xs uppercase tracking-widest text-white/50">Saved resources</div>
          </div>
          <div className="display text-5xl">{bookmarks.length}</div>
          <div className="text-xs text-white/40 mt-2">Bookmark any resource to find it fast</div>
        </Card>
      </div>

      {/* Global search */}
      <div className="sticky top-2 z-20 mb-8">
        <label className="sr-only" htmlFor="hub-search">Search topics and resources</label>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl px-4 py-3">
          <Search className="w-5 h-5 text-white/40" aria-hidden="true" />
          <input
            id="hub-search"
            className="flex-1 bg-transparent outline-none text-white placeholder-white/30"
            placeholder="Search topics, languages, DSA, interview prep…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          {searching && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-xs text-white/40 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Section nav (hidden while searching) */}
      {!searching && (
        <nav aria-label="Hub sections" className="flex flex-wrap gap-2 mb-10">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-xs px-3 py-1.5 rounded-full border border-white/15 text-white/70 hover:border-[var(--color-neon)] hover:text-[var(--color-neon)] transition-colors"
            >
              {s.title}
            </a>
          ))}
        </nav>
      )}

      {/* Search results OR all sections */}
      {searching ? (
        <section>
          <div className="mono text-xs uppercase tracking-widest text-white/50 mb-4">
            {results.length} {results.length === 1 ? "result" : "results"} for “{query}”
          </div>
          {results.length === 0 ? (
            <div className="text-white/40 text-center py-20">No topics match your search.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map(({ topic }) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  completed={isComplete(topic.id)}
                  onToggleComplete={() => toggleComplete(topic.id)}
                  isBookmarked={isBookmarked}
                  onToggleBookmark={toggleBookmark}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <div className="space-y-14">
          {SECTIONS.map((section) => (
            <HubSectionView
              key={section.id}
              section={section}
              isComplete={isComplete}
              onToggleComplete={toggleComplete}
              isBookmarked={isBookmarked}
              onToggleBookmark={toggleBookmark}
            />
          ))}
        </div>
      )}

      <div className="mt-16 flex flex-wrap gap-3">
        <Link to="/dashboard" className="text-sm text-[var(--color-neon)] underline">
          ← Back to dashboard
        </Link>
        <span className="text-white/20">·</span>
        <Link to="/dsa" className="text-sm text-white/60 hover:text-white">
          Open the DSA practice tracker
        </Link>
      </div>
    </div>
  );
}
