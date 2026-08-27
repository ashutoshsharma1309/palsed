// Lightweight, purpose-built lesson animations. Each one clarifies a single
// concept (not decoration) and is reduced-motion aware. Registered by name so a
// lesson references a visual with pure data (`visual: { kind: "anim", name }`).
import { motion, useReducedMotion } from "framer-motion";
import type { AnimName } from "../../content/types";

const box =
  "flex items-center justify-center rounded-xl border border-[var(--color-line)] bg-[var(--color-card-soft)] text-[13px] font-medium text-[var(--color-text)]";

// ── HTTP request/response loop ──────────────────────────────────────────────
function HttpRequest() {
  const reduce = useReducedMotion();
  return (
    <div className="relative flex items-center justify-between gap-4 py-8 px-2">
      <div className={`${box} w-24 h-16`}>Browser</div>
      <div className="relative flex-1 h-16">
        <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-[var(--color-line)]" />
        {!reduce && (
          <>
            <motion.div
              className="absolute top-[6px] w-3 h-3 rounded-full bg-[var(--color-neon)]"
              animate={{ left: ["0%", "100%"] }}
              transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-[6px] w-3 h-3 rounded-full bg-[var(--color-blue)]"
              animate={{ right: ["0%", "100%"] }}
              transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.4, delay: 1.4, ease: "easeInOut" }}
            />
          </>
        )}
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 mono text-[10px] text-[var(--color-neon-text)]">GET →</span>
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 mono text-[10px] text-[var(--color-text-faint)]">← 200 OK</span>
      </div>
      <div className={`${box} w-24 h-16`}>Server</div>
    </div>
  );
}

// ── Neural network forward pass ─────────────────────────────────────────────
function NeuralForward() {
  const reduce = useReducedMotion();
  const cols = [3, 4, 2];
  return (
    <div className="flex items-center justify-between gap-8 py-8 px-6">
      {cols.map((n, ci) => (
        <div key={ci} className="flex flex-col gap-3">
          {Array.from({ length: n }).map((_, ni) => (
            <motion.div
              key={ni}
              className="w-8 h-8 rounded-full border border-[var(--color-line)] bg-[var(--color-card-soft)]"
              animate={reduce ? {} : { backgroundColor: ["var(--color-card-soft)", "var(--color-neon)", "var(--color-card-soft)"] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.8, delay: ci * 0.6, ease: "easeInOut" }}
            />
          ))}
          <span className="mono text-[10px] text-center text-[var(--color-text-faint)] mt-1">
            {ci === 0 ? "input" : ci === cols.length - 1 ? "output" : "hidden"}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Array traversal ─────────────────────────────────────────────────────────
function ArrayTraversal() {
  const reduce = useReducedMotion();
  const cells = [4, 8, 15, 16, 23, 42];
  return (
    <div className="relative flex gap-2 py-10 px-2 justify-center">
      {cells.map((v, i) => (
        <div key={i} className={`${box} w-12 h-12 relative`}>
          {v}
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 mono text-[10px] text-[var(--color-text-faint)]">{i}</span>
        </div>
      ))}
      {!reduce && (
        <motion.div
          className="absolute top-10 left-2 w-12 h-12 rounded-xl border-2 border-[var(--color-neon)] pointer-events-none"
          animate={{ x: cells.map((_, i) => i * 56) }}
          transition={{ duration: cells.length * 0.5, repeat: Infinity, ease: "linear", repeatDelay: 0.6 }}
        />
      )}
    </div>
  );
}

// ── Stack push / pop ────────────────────────────────────────────────────────
function StackPushPop() {
  const reduce = useReducedMotion();
  const CYCLE = 4;
  return (
    <div className="flex items-end justify-center gap-10 py-8">
      <div className="flex flex-col-reverse items-center gap-1.5">
        {[10, 20, 30].map((v) => (
          <div key={v} className={`${box} w-20 h-9`}>{v}</div>
        ))}
        {!reduce && (
          <motion.div
            className={`${box} w-20 h-9 border-[var(--color-neon)]`}
            animate={{ y: [-46, 0, 0, -46], opacity: [0, 1, 1, 0] }}
            transition={{ duration: CYCLE, times: [0, 0.25, 0.7, 1], repeat: Infinity, ease: "easeInOut" }}
          >
            40
          </motion.div>
        )}
        <span className="mono text-[10px] text-[var(--color-text-faint)] mt-2">bottom</span>
      </div>
      <div className="flex flex-col gap-6 mono text-[10px]">
        {!reduce && (
          <>
            <motion.span
              className="text-[var(--color-neon-text)]"
              animate={{ opacity: [0, 1, 0, 0] }}
              transition={{ duration: CYCLE, times: [0, 0.25, 0.5, 1], repeat: Infinity }}
            >
              push(40) →
            </motion.span>
            <motion.span
              className="text-[var(--color-text-faint)]"
              animate={{ opacity: [0, 0, 1, 0] }}
              transition={{ duration: CYCLE, times: [0, 0.6, 0.85, 1], repeat: Infinity }}
            >
              ← pop() = 40
            </motion.span>
          </>
        )}
        <span className="text-[var(--color-text-faint)]">top only (LIFO)</span>
      </div>
    </div>
  );
}

// ── Queue enqueue / dequeue ─────────────────────────────────────────────────
function QueueAnim() {
  const reduce = useReducedMotion();
  return (
    <div className="py-10 px-4">
      <div className="relative flex items-center justify-center gap-2">
        <span className="mono text-[10px] text-[var(--color-text-faint)] mr-2">dequeue ←</span>
        {[7, 3, 9].map((v, i) =>
          reduce ? (
            <div key={v} className={`${box} w-12 h-12`}>{v}</div>
          ) : (
            <motion.div
              key={v}
              className={`${box} w-12 h-12`}
              animate={{ x: [0, 0, -56, -56] }}
              transition={{ duration: 3.6, times: [0, 0.55, 0.8, 1], repeat: Infinity, ease: "easeInOut" }}
            >
              {v}
            </motion.div>
          )
        )}
        {!reduce && (
          <motion.div
            className={`${box} w-12 h-12 border-[var(--color-neon)]`}
            animate={{ x: [40, 0, -56, -56], opacity: [0, 1, 1, 1] }}
            transition={{ duration: 3.6, times: [0, 0.3, 0.8, 1], repeat: Infinity, ease: "easeInOut" }}
          >
            5
          </motion.div>
        )}
        <span className="mono text-[10px] text-[var(--color-text-faint)] ml-2">← enqueue</span>
      </div>
      <p className="mono text-center text-[10px] text-[var(--color-text-faint)] mt-6">
        first in, first out (FIFO)
      </p>
    </div>
  );
}

// ── Linked-list traversal ───────────────────────────────────────────────────
function LinkedListAnim() {
  const reduce = useReducedMotion();
  const nodes = [4, 8, 15, 16];
  return (
    <div className="relative flex items-center justify-center gap-0 py-10">
      {nodes.map((v, i) => (
        <div key={i} className="flex items-center">
          <div className={`${box} w-14 h-12 relative`}>
            {v}
            {!reduce && (
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-[var(--color-neon)] pointer-events-none"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.9, delay: i * 0.9, repeat: Infinity, repeatDelay: nodes.length * 0.9 - 0.9 }}
              />
            )}
          </div>
          {i < nodes.length - 1 && <span className="mx-1 text-[var(--color-text-faint)]">→</span>}
        </div>
      ))}
      <span className="mono text-[10px] text-[var(--color-text-faint)] ml-3">→ null</span>
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 mono text-[10px] text-[var(--color-text-faint)]">
        no random access — follow the pointers one hop at a time
      </span>
    </div>
  );
}

// ── Binary-tree traversal (level order) ─────────────────────────────────────
function TreeTraversal() {
  const reduce = useReducedMotion();
  // 7 nodes, order = level-order (BFS): value → visit order index
  const nodes: { v: number; x: number; y: number; order: number }[] = [
    { v: 8, x: 50, y: 8, order: 0 },
    { v: 4, x: 28, y: 42, order: 1 },
    { v: 12, x: 72, y: 42, order: 2 },
    { v: 2, x: 16, y: 76, order: 3 },
    { v: 6, x: 40, y: 76, order: 4 },
    { v: 10, x: 60, y: 76, order: 5 },
    { v: 14, x: 84, y: 76, order: 6 },
  ];
  const edges: [number, number][] = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]];
  const STEP = 0.7;
  const TOTAL = nodes.length * STEP + 1.2;
  return (
    <div className="relative h-52 mx-auto max-w-md py-2">
      <svg className="absolute inset-0 w-full h-full" aria-hidden>
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={`${nodes[a].x}%`} y1={`${nodes[a].y + 8}%`}
            x2={`${nodes[b].x}%`} y2={`${nodes[b].y}%`}
            stroke="var(--color-line)" strokeWidth="1.5"
          />
        ))}
      </svg>
      {nodes.map((n) => (
        <motion.div
          key={n.v}
          className="absolute w-9 h-9 -translate-x-1/2 rounded-full border border-[var(--color-line)] bg-[var(--color-card-soft)] grid place-items-center text-[12px] font-medium text-[var(--color-text)]"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
          animate={reduce ? {} : {
            borderColor: ["var(--color-line)", "var(--color-neon)", "var(--color-line)"],
            backgroundColor: ["var(--color-card-soft)", "var(--color-neon)", "var(--color-card-soft)"],
          }}
          transition={{ duration: STEP, delay: n.order * STEP, repeat: Infinity, repeatDelay: TOTAL - STEP }}
        >
          {n.v}
        </motion.div>
      ))}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 mono text-[10px] text-[var(--color-text-faint)]">
        level-order (BFS): visit each level left → right
      </span>
    </div>
  );
}

// ── Graph BFS wave ──────────────────────────────────────────────────────────
function GraphTraversal() {
  const reduce = useReducedMotion();
  // small graph; layer = BFS distance from source A
  const nodes: { id: string; x: number; y: number; layer: number }[] = [
    { id: "A", x: 12, y: 45, layer: 0 },
    { id: "B", x: 38, y: 16, layer: 1 },
    { id: "C", x: 38, y: 74, layer: 1 },
    { id: "D", x: 64, y: 32, layer: 2 },
    { id: "E", x: 64, y: 62, layer: 2 },
    { id: "F", x: 88, y: 47, layer: 3 },
  ];
  const edges: [string, string][] = [["A", "B"], ["A", "C"], ["B", "D"], ["C", "E"], ["D", "F"], ["E", "F"], ["B", "C"]];
  const pos = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const STEP = 0.9;
  const TOTAL = 4 * STEP + 1.4;
  return (
    <div className="relative h-48 mx-auto max-w-md py-2">
      <svg className="absolute inset-0 w-full h-full" aria-hidden>
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={`${pos[a].x + 3}%`} y1={`${pos[a].y + 8}%`}
            x2={`${pos[b].x + 3}%`} y2={`${pos[b].y + 8}%`}
            stroke="var(--color-line)" strokeWidth="1.5"
          />
        ))}
      </svg>
      {nodes.map((n) => (
        <motion.div
          key={n.id}
          className="absolute w-9 h-9 rounded-full border border-[var(--color-line)] bg-[var(--color-card-soft)] grid place-items-center text-[12px] font-medium text-[var(--color-text)]"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
          animate={reduce ? {} : {
            borderColor: ["var(--color-line)", "var(--color-neon)", "var(--color-line)"],
            backgroundColor: ["var(--color-card-soft)", "var(--color-neon)", "var(--color-card-soft)"],
          }}
          transition={{ duration: STEP, delay: n.layer * STEP, repeat: Infinity, repeatDelay: TOTAL - STEP }}
        >
          {n.id}
        </motion.div>
      ))}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 mono text-[10px] text-[var(--color-text-faint)]">
        BFS expands in waves — each ring is one edge farther from A
      </span>
    </div>
  );
}

const REGISTRY: Partial<Record<AnimName, () => React.ReactElement>> = {
  httpRequest: HttpRequest,
  neuralForward: NeuralForward,
  arrayTraversal: ArrayTraversal,
  stackPushPop: StackPushPop,
  queue: QueueAnim,
  linkedList: LinkedListAnim,
  treeTraversal: TreeTraversal,
  graphTraversal: GraphTraversal,
};

export function getAnimation(name: AnimName): (() => React.ReactElement) | null {
  return REGISTRY[name] ?? null;
}
