// PrepNext — Coding Patterns curriculum (Task 2).
//
// A standalone learning module (separate from the DSA Roadmap) that teaches the
// recurring *shapes* of DSA / CP solutions: how to recognize them, when to reach
// for them, and when not to. Content is synthesized in our own words — references
// (Striver A2Z, NeetCode, CP-Algorithms, USACO Guide, CSES, GfG) informed the
// curriculum's scope, not its text.
//
// Pure data — no React imports — so it stays trivially testable and extensible.
import type { Question, ChecklistItem, Difficulty, Solution } from "../dsa/roadmap";

const cpp = (s: string): Solution => ({ cpp: s });

// Compact question builder to keep the data readable.
function q(
  id: string,
  title: string,
  difficulty: Difficulty,
  statement: string,
  concepts: string[],
  hint: string,
  code: string,
  timeComplexity = "O(n)",
  spaceComplexity = "O(1)"
): Question {
  return { id, title, statement, difficulty, concepts, hint, solution: cpp(code), timeComplexity, spaceComplexity };
}

export interface Pattern {
  id: string;
  name: string;
  category: string;
  /** One-line teaser for the list view. */
  blurb: string;
  definition: string;
  /** Why this pattern is useful — the payoff. */
  why: string;
  /** How to recognize a problem that wants this pattern. */
  recognitionClues: string[];
  whenToUse: string[];
  whenNotToUse: string[];
  example: { code: string; explanation?: string };
  interviewNotes: string[];
  questions: Question[];
}

// Shared checklist for every pattern lesson. Persists per-pattern via the central
// learning store; completing one item counts as learning activity (streak).
export const PATTERN_CHECKLIST: ChecklistItem[] = [
  { id: "definition", label: "Read the definition" },
  { id: "recognition", label: "Understood the recognition cues" },
  { id: "example", label: "Ran the example code" },
  { id: "practice", label: "Solved practice problems" },
  { id: "revised", label: "Revised" },
];

// Category display order (groups the list view).
export const PATTERN_CATEGORIES = [
  "Foundations",
  "Arrays & Strings",
  "Recursion & Backtracking",
  "Optimization",
  "Stacks & Queues",
  "Trees & Graphs",
  "Advanced",
] as const;

export const PATTERNS: Pattern[] = [
  // ============================ FOUNDATIONS ============================
  {
    id: "io-patterns",
    name: "Input / Output Patterns",
    category: "Foundations",
    blurb: "Fast, correct reading of competitive-style input — the thing that silently fails first.",
    definition: "Standard ways to read mixed input (counts, arrays, test cases) and print results efficiently in C++.",
    why: "Most CP wrong-answers and TLEs at the start are I/O bugs: slow cin/cout, or mis-reading the number of test cases. Getting this reflexive frees your attention for the algorithm.",
    recognitionClues: ["A first line gives `T` test cases", "A line gives `n`, then `n` numbers follow", "Large input (10^6+ numbers)"],
    whenToUse: ["Any competitive judge (Codeforces, CSES, AtCoder)", "When input size is large and `endl` / unsynced streams cause TLE"],
    whenNotToUse: ["Interview pad / LeetCode (function signature is given — no manual parsing)"],
    example: {
      code: `ios::sync_with_stdio(false);\ncin.tie(nullptr);          // fast I/O\nint t; cin >> t;\nwhile (t--) {\n  int n; cin >> n;\n  vector<int> a(n);\n  for (auto& x : a) cin >> x;\n  // ... solve, then print one answer per line\n  cout << solve(a) << '\\n';   // '\\n' not endl (no flush)\n}`,
      explanation: "Unsyncing the C++ streams + using '\\n' instead of endl is the standard fast-I/O preamble.",
    },
    interviewNotes: ["In interviews you rarely parse input — but knowing it signals CP experience.", "`'\\n'` avoids the flush that `endl` forces."],
    questions: [
      q("io-sum-tests", "Sum per test case", "Easy",
        "Given T test cases, each an array of n integers, print the sum of each.",
        ["Fast I/O", "Loops"], "Read T, loop T times, accumulate.",
        `int t; cin>>t;\nwhile(t--){\n  int n; cin>>n; long long s=0,x;\n  while(n--){ cin>>x; s+=x; }\n  cout<<s<<'\\n';\n}`, "O(total n)", "O(1)"),
    ],
  },
  {
    id: "loop-patterns",
    name: "Loop Patterns",
    category: "Foundations",
    blurb: "Counting, accumulating, searching — the four or five loop shapes behind everything.",
    definition: "Canonical single-loop shapes: accumulate a result, count matches, find a min/max, or search for an element.",
    why: "Almost every linear-time solution is one of a handful of loop shapes. Recognizing them lets you write bug-free loops without thinking about bounds each time.",
    recognitionClues: ["\"Find the largest / smallest / total\"", "\"How many elements satisfy …\"", "A single pass is enough"],
    whenToUse: ["O(n) aggregation over a sequence", "Building a running result (sum, max, count)"],
    whenNotToUse: ["You need every pair (that's nested loops)", "Data is sorted and you can binary search"],
    example: {
      code: `int mx = INT_MIN, cnt = 0; long long sum = 0;\nfor (int x : a) {\n  mx = max(mx, x);          // running max\n  sum += x;                 // accumulate\n  if (x % 2 == 0) cnt++;    // count matches\n}`,
      explanation: "Three independent running results computed in one O(n) pass.",
    },
    interviewNotes: ["Initialize max with INT_MIN / first element, not 0.", "Use `long long` for sums to avoid overflow."],
    questions: [
      q("loop-count-even", "Count evens", "Easy",
        "Count how many numbers in the array are even.",
        ["Loops", "Counting"], "One pass with a counter.",
        `int cnt=0; for(int x:a) if(x%2==0) cnt++; return cnt;`),
      q("loop-running-max", "Running maximum", "Easy",
        "Return the maximum element of an array in a single pass.",
        ["Loops"], "Track a running max; seed with the first element.",
        `int mx=a[0]; for(int x:a) mx=max(mx,x); return mx;`),
    ],
  },
  {
    id: "nested-loop-patterns",
    name: "Nested Loop Patterns",
    category: "Foundations",
    blurb: "Pairs, grids, and the O(n²) baseline you optimize away later.",
    definition: "A loop inside a loop — used to enumerate all pairs, fill a 2-D grid, or compare every element to every other.",
    why: "The brute-force baseline for most array problems is a nested loop. Writing it correctly first (then optimizing) is a reliable interview strategy.",
    recognitionClues: ["\"All pairs\" / \"every two elements\"", "A 2-D grid / matrix", "Pattern printing (rows × columns)"],
    whenToUse: ["n is small (≤ ~2000) so O(n²) passes", "Building a brute-force baseline before optimizing"],
    whenNotToUse: ["n is large — find a single-pass / hashing / sorting trick instead"],
    example: {
      code: `// Count pairs (i<j) with a[i]+a[j]==target  (brute force)\nint cnt = 0;\nfor (int i = 0; i < n; i++)\n  for (int j = i + 1; j < n; j++)\n    if (a[i] + a[j] == target) cnt++;`,
      explanation: "`j = i+1` avoids counting a pair twice and skips self-pairs — the standard pair-enumeration shape.",
    },
    interviewNotes: ["Start `j` at `i+1` for unordered pairs.", "Always state the O(n²) baseline, then propose the hashing/two-pointer improvement."],
    questions: [
      q("nested-pair-sum", "Count target pairs", "Easy",
        "Count pairs (i<j) whose values sum to a target.",
        ["Nested loops"], "Inner loop starts at i+1.",
        `int c=0; for(int i=0;i<n;i++) for(int j=i+1;j<n;j++) if(a[i]+a[j]==t) c++; return c;`, "O(n^2)", "O(1)"),
    ],
  },
  {
    id: "number-patterns",
    name: "Number Patterns",
    category: "Foundations",
    blurb: "Digit extraction, divisibility, and the math micro-skills interviews assume.",
    definition: "Techniques for working with the digits and divisors of integers: extract digits, reverse, count, check properties.",
    why: "Reversing a number, summing digits, or checking a palindrome appears constantly in warmups and as sub-steps of bigger problems.",
    recognitionClues: ["\"Sum/reverse the digits\"", "\"Is it a palindrome / Armstrong / prime\"", "Operations on individual digits"],
    whenToUse: ["Digit manipulation without converting to a string", "Divisor / factor problems"],
    whenNotToUse: ["You genuinely need string operations (then convert)"],
    example: {
      code: `// Reverse the digits of n\nint rev = 0;\nwhile (n > 0) {\n  rev = rev * 10 + n % 10;  // append last digit\n  n /= 10;                  // drop last digit\n}`,
      explanation: "`n % 10` peels the last digit, `n /= 10` removes it — the core digit loop.",
    },
    interviewNotes: ["Reversal can overflow — use `long long` or check bounds.", "`n % 10` and `n /= 10` is the digit-by-digit idiom."],
    questions: [
      q("num-digit-sum", "Digit sum", "Easy",
        "Return the sum of the digits of a non-negative integer n.",
        ["Number patterns"], "Peel digits with %10 and /10.",
        `int s=0; while(n>0){ s+=n%10; n/=10; } return s;`, "O(log n)", "O(1)"),
      q("num-palindrome", "Palindrome number", "Easy",
        "Return true if an integer reads the same forwards and backwards (no string conversion).",
        ["Number patterns"], "Reverse the number and compare; negatives are never palindromes.",
        `if(x<0) return false;\nlong long r=0,t=x;\nwhile(t>0){ r=r*10+t%10; t/=10; }\nreturn r==x;`, "O(log n)", "O(1)"),
    ],
  },
  {
    id: "star-patterns",
    name: "Star / Shape Patterns",
    category: "Foundations",
    blurb: "Triangles, pyramids, diamonds — nested-loop control made visual.",
    definition: "Printing 2-D character shapes by controlling how many characters each row prints via nested loops.",
    why: "Shape problems are the classic way to build intuition for nested loops and index math — and they appear in many first-round / campus tests.",
    recognitionClues: ["\"Print a triangle / pyramid / diamond\"", "Output is a 2-D arrangement of characters", "Row count drives the inner loop bound"],
    whenToUse: ["Learning nested-loop control", "Campus aptitude / first-round coding screens"],
    whenNotToUse: ["Real algorithmic problems (this is a teaching device)"],
    example: {
      code: `// Pyramid of height n\nfor (int i = 1; i <= n; i++) {\n  for (int s = 0; s < n - i; s++) cout << ' ';   // leading spaces\n  for (int k = 0; k < 2 * i - 1; k++) cout << '*'; // stars\n  cout << '\\n';\n}`,
      explanation: "Row i prints (n−i) spaces then (2i−1) stars — the centered-pyramid formula.",
    },
    interviewNotes: ["Derive the per-row formula (spaces, stars) before coding.", "Off-by-one in the inner bound is the usual bug."],
    questions: [
      q("star-right-triangle", "Right triangle", "Easy",
        "Print a right-angled triangle of '*' with height n (row i has i stars).",
        ["Nested loops", "Star patterns"], "Inner loop runs i times.",
        `for(int i=1;i<=n;i++){ for(int j=0;j<i;j++) cout<<'*'; cout<<'\\n'; }`, "O(n^2)", "O(1)"),
    ],
  },

  // ========================= ARRAYS & STRINGS =========================
  {
    id: "two-pointer",
    name: "Two Pointer",
    category: "Arrays & Strings",
    blurb: "Two indices walking a sequence — collapse an O(n²) scan into O(n).",
    definition: "Maintain two indices (from both ends, or a slow/fast pair) that move based on a condition, processing each element O(1) times.",
    why: "Replaces nested loops on sorted arrays / strings with a single linear pass — and is the backbone of many in-place array tricks.",
    recognitionClues: ["Array/string is sorted (or can be)", "\"Pair / triplet that sums to X\"", "\"In-place\" rearrangement", "Palindrome check"],
    whenToUse: ["Sorted input + searching for a pair with a target", "Reversing / partitioning in place", "Removing duplicates in place"],
    whenNotToUse: ["Unsorted input where order matters and you can't sort", "You need all pairs regardless of a condition"],
    example: {
      code: `// Does a sorted array contain two numbers summing to target?\nint l = 0, r = n - 1;\nwhile (l < r) {\n  int s = a[l] + a[r];\n  if (s == target) return true;\n  if (s < target) l++;   // need a bigger sum\n  else r--;              // need a smaller sum\n}\nreturn false;`,
      explanation: "Because the array is sorted, moving `l` only grows the sum and `r` only shrinks it — so one pass suffices.",
    },
    interviewNotes: ["Sorting first (O(n log n)) is often worth it to unlock two pointers.", "Fast/slow pointers detect cycles and find middles in linked lists."],
    questions: [
      q("tp-two-sum-sorted", "Two Sum II (sorted)", "Easy",
        "Given a sorted array, return indices of two numbers that add to target.",
        ["Two pointers"], "Move l/r inward based on the sum vs target.",
        `int l=0,r=n-1;\nwhile(l<r){ int s=a[l]+a[r];\n  if(s==t) return {l,r};\n  s<t ? l++ : r--; }\nreturn {-1,-1};`),
      q("tp-is-palindrome", "Valid palindrome", "Easy",
        "Check if a string reads the same forwards and backwards (alphanumeric only).",
        ["Two pointers", "Strings"], "Compare s[l] and s[r], skip non-alphanumeric.",
        `int l=0,r=s.size()-1;\nwhile(l<r){\n  if(!isalnum(s[l])){l++;continue;}\n  if(!isalnum(s[r])){r--;continue;}\n  if(tolower(s[l])!=tolower(s[r])) return false;\n  l++; r--;\n}\nreturn true;`),
      q("tp-three-sum", "3Sum", "Medium",
        "Find all unique triplets that sum to zero.",
        ["Two pointers", "Sorting"], "Fix one element, two-pointer the rest; skip duplicates.",
        `sort(a.begin(),a.end());\nvector<vector<int>> res;\nfor(int i=0;i<n-2;i++){\n  if(i&&a[i]==a[i-1]) continue;\n  int l=i+1,r=n-1;\n  while(l<r){ int s=a[i]+a[l]+a[r];\n    if(s==0){ res.push_back({a[i],a[l],a[r]});\n      while(l<r&&a[l]==a[l+1])l++;\n      while(l<r&&a[r]==a[r-1])r--; l++;r--; }\n    else if(s<0) l++; else r--; }\n}\nreturn res;`, "O(n^2)", "O(1)"),
    ],
  },
  {
    id: "sliding-window",
    name: "Sliding Window",
    category: "Arrays & Strings",
    blurb: "A growing/shrinking contiguous range — best subarray/substring in O(n).",
    definition: "Maintain a contiguous window [l, r] and a running aggregate; expand `r` to include elements and contract `l` to restore a constraint.",
    why: "Turns 'best contiguous subarray/substring with property P' from O(n²) brute force into a single O(n) pass.",
    recognitionClues: ["\"Contiguous subarray / substring\"", "\"Longest / shortest / max-sum window\"", "A constraint like 'at most k distinct' or 'sum ≤ S'"],
    whenToUse: ["Fixed-size window (max sum of k consecutive)", "Variable window (longest substring without repeats)"],
    whenNotToUse: ["Subsequence (non-contiguous) problems", "Order doesn't matter / you can reorder"],
    example: {
      code: `// Longest substring without repeating characters\nint last[256]; memset(last, -1, sizeof last);\nint l = 0, best = 0;\nfor (int r = 0; r < (int)s.size(); r++) {\n  if (last[s[r]] >= l) l = last[s[r]] + 1;  // shrink past the repeat\n  last[s[r]] = r;\n  best = max(best, r - l + 1);\n}`,
      explanation: "`l` jumps to just after the previous occurrence of the current char, keeping the window repeat-free.",
    },
    interviewNotes: ["Fixed window: add a[r], remove a[r-k].", "Variable window: while the constraint breaks, shrink from l."],
    questions: [
      q("sw-max-sum-k", "Max sum of size-k window", "Easy",
        "Find the maximum sum of any k consecutive elements.",
        ["Sliding window"], "Slide: add the new element, drop the one leaving.",
        `long long s=0; for(int i=0;i<k;i++) s+=a[i];\nlong long best=s;\nfor(int i=k;i<n;i++){ s+=a[i]-a[i-k]; best=max(best,s); }\nreturn best;`),
      q("sw-longest-unique", "Longest substring w/o repeats", "Medium",
        "Length of the longest substring with all distinct characters.",
        ["Sliding window", "Hashing"], "Track last index of each char; move l past repeats.",
        `vector<int> last(256,-1); int l=0,best=0;\nfor(int r=0;r<(int)s.size();r++){\n  if(last[s[r]]>=l) l=last[s[r]]+1;\n  last[s[r]]=r; best=max(best,r-l+1);\n}\nreturn best;`, "O(n)", "O(1)"),
    ],
  },
  {
    id: "prefix-sum",
    name: "Prefix Sum",
    category: "Arrays & Strings",
    blurb: "Precompute running totals → answer any range-sum query in O(1).",
    definition: "Build an array `pre` where `pre[i]` is the sum of the first i elements; then `sum(l..r) = pre[r+1] − pre[l]`.",
    why: "Converts repeated range-sum queries from O(n) each to O(1) each after an O(n) precompute — and powers many subarray-count tricks via hashing.",
    recognitionClues: ["Many range-sum / range-count queries", "\"Subarray summing to k\"", "\"Equal number of X and Y\" (map to +1/−1)"],
    whenToUse: ["Static array, many sum queries", "Counting subarrays with a target sum (prefix + hashmap)"],
    whenNotToUse: ["The array changes between queries (use a Fenwick / segment tree)"],
    example: {
      code: `// Count subarrays summing to k  (prefix sum + hashmap)\nunordered_map<long long,int> cnt{{0,1}};\nlong long pre = 0; int ans = 0;\nfor (int x : a) {\n  pre += x;\n  ans += cnt[pre - k];   // a previous prefix that makes the gap == k\n  cnt[pre]++;\n}`,
      explanation: "If `pre − k` was seen before, the elements between then and now sum to exactly k.",
    },
    interviewNotes: ["Seed the map with {0:1} so subarrays starting at index 0 count.", "2-D prefix sums answer submatrix-sum queries in O(1)."],
    questions: [
      q("ps-range-sum", "Range sum query (immutable)", "Easy",
        "Answer many sum(l..r) queries on a fixed array.",
        ["Prefix sum"], "pre[i+1]=pre[i]+a[i]; answer = pre[r+1]-pre[l].",
        `vector<long long> pre(n+1,0);\nfor(int i=0;i<n;i++) pre[i+1]=pre[i]+a[i];\n// query(l,r): return pre[r+1]-pre[l];`, "O(n) build, O(1) query", "O(n)"),
      q("ps-subarray-sum-k", "Subarray sum equals k", "Medium",
        "Count subarrays whose elements sum to k.",
        ["Prefix sum", "Hashing"], "Map prefix-sum frequencies; look for pre-k.",
        `unordered_map<long long,int> m{{0,1}}; long long p=0; int ans=0;\nfor(int x:a){ p+=x; ans+=m[p-k]; m[p]++; }\nreturn ans;`, "O(n)", "O(n)"),
    ],
  },
  {
    id: "binary-search-pattern",
    name: "Binary Search Pattern",
    category: "Arrays & Strings",
    blurb: "Halve the search space each step — including 'binary search on the answer'.",
    definition: "Repeatedly halve a sorted/monotonic search space by testing the midpoint and discarding the half that can't contain the answer.",
    why: "O(log n) lookups, and — crucially — 'binary search on the answer' solves many 'minimum feasible X' problems that look unrelated to searching.",
    recognitionClues: ["Sorted array + find/insert position", "\"Minimum/maximum value such that a condition holds\"", "A monotonic feasibility check `can(x)`"],
    whenToUse: ["Search in sorted data", "Optimize a value where feasibility is monotonic (min capacity, max distance)"],
    whenNotToUse: ["Unsorted data with no monotonic predicate", "Tiny n where linear is simpler"],
    example: {
      code: `// Binary search on the answer: smallest x with can(x) true\nint lo = LO, hi = HI, ans = HI;\nwhile (lo <= hi) {\n  int mid = lo + (hi - lo) / 2;     // avoids overflow\n  if (can(mid)) { ans = mid; hi = mid - 1; }\n  else          { lo = mid + 1; }\n}`,
      explanation: "`can()` must be monotonic (false…false,true…true); we shrink toward the boundary.",
    },
    interviewNotes: ["Use `lo + (hi-lo)/2` to avoid integer overflow.", "Decide the invariant first: is `mid` a candidate answer or to be excluded?"],
    questions: [
      q("bs-lower-bound", "First position ≥ target", "Easy",
        "Return the first index where a[i] ≥ target in a sorted array.",
        ["Binary search"], "Standard lower_bound loop.",
        `int lo=0,hi=n;\nwhile(lo<hi){ int m=lo+(hi-lo)/2;\n  if(a[m]<t) lo=m+1; else hi=m; }\nreturn lo;`, "O(log n)", "O(1)"),
      q("bs-koko", "Minimum eating speed", "Medium",
        "Find the smallest speed k so all piles are eaten within h hours (binary search on k).",
        ["Binary search on answer"], "can(k) = total hours ≤ h; monotonic in k.",
        `auto can=[&](long long k){ long long h=0; for(int p:piles) h+=(p+k-1)/k; return h<=H; };\nint lo=1,hi=*max_element(piles.begin(),piles.end());\nwhile(lo<hi){ int m=lo+(hi-lo)/2; if(can(m)) hi=m; else lo=m+1; }\nreturn lo;`, "O(n log max)", "O(1)"),
    ],
  },

  // ===================== RECURSION & BACKTRACKING =====================
  {
    id: "recursion-pattern",
    name: "Recursion Pattern",
    category: "Recursion & Backtracking",
    blurb: "Solve a problem by solving smaller copies of itself — base case + recursive step.",
    definition: "A function that calls itself on a smaller input, with a base case that stops the recursion and combines sub-results.",
    why: "Recursion expresses divide-and-conquer, tree/graph traversal, and backtracking naturally — and is the mental model behind dynamic programming.",
    recognitionClues: ["The problem is defined in terms of itself (factorial, Fibonacci)", "Tree / nested structure", "\"Generate all …\""],
    whenToUse: ["Tree/graph traversal", "Problems with a natural recursive definition", "Setting up DP (then memoize)"],
    whenNotToUse: ["Depth can blow the stack (convert to iteration)", "Overlapping subproblems without memoization (exponential)"],
    example: {
      code: `// Factorial\nlong long fact(int n) {\n  if (n <= 1) return 1;        // base case\n  return n * fact(n - 1);      // recursive step\n}`,
      explanation: "Every recursion needs a base case (stops) and a step that shrinks the input toward it.",
    },
    interviewNotes: ["Always state the base case first.", "Draw the recursion tree to find overlapping subproblems → memoize."],
    questions: [
      q("rec-fib", "Fibonacci (memoized)", "Easy",
        "Return the n-th Fibonacci number using recursion + memoization.",
        ["Recursion", "Memoization"], "Cache results to avoid recomputation.",
        `vector<long long> memo(n+1,-1);\nfunction<long long(int)> f=[&](int k)->long long{\n  if(k<2) return k;\n  if(memo[k]!=-1) return memo[k];\n  return memo[k]=f(k-1)+f(k-2);\n};\nreturn f(n);`, "O(n)", "O(n)"),
      q("rec-power", "Fast power (recursive)", "Medium",
        "Compute x^n using recursion in O(log n).",
        ["Recursion", "Divide and conquer"], "x^n = (x^(n/2))^2, times x if n is odd.",
        `double pow(double x,long long n){\n  if(n==0) return 1;\n  if(n<0){ x=1/x; n=-n; }\n  double half=pow(x,n/2);\n  return (n&1) ? half*half*x : half*half;\n}`, "O(log n)", "O(log n)"),
    ],
  },
  {
    id: "backtracking-pattern",
    name: "Backtracking Pattern",
    category: "Recursion & Backtracking",
    blurb: "Build candidates incrementally; undo a choice when it can't lead to a solution.",
    definition: "Systematic recursion that makes a choice, recurses, then *undoes* the choice (backtracks) to explore alternatives — pruning dead ends early.",
    why: "The go-to for 'generate all valid combinations/permutations/arrangements' and constraint puzzles (N-Queens, Sudoku) where brute force is too broad.",
    recognitionClues: ["\"All permutations / combinations / subsets\"", "Constraint puzzle (place items legally)", "Build a solution step by step with validity checks"],
    whenToUse: ["Enumerate all solutions under constraints", "Search with pruning (early invalidity check)"],
    whenNotToUse: ["A greedy or DP gives the count/optimum directly", "The state space is astronomically large with no pruning"],
    example: {
      code: `// All subsets (power set)\nvoid dfs(int i, vector<int>& a, vector<int>& cur, vector<vector<int>>& res) {\n  if (i == (int)a.size()) { res.push_back(cur); return; }\n  dfs(i + 1, a, cur, res);          // skip a[i]\n  cur.push_back(a[i]);\n  dfs(i + 1, a, cur, res);          // take a[i]\n  cur.pop_back();                   // backtrack (undo)\n}`,
      explanation: "Each element is either skipped or taken; `pop_back()` undoes the choice so the other branch sees a clean state.",
    },
    interviewNotes: ["The `pop_back()` / undo step is what makes it backtracking (vs plain recursion).", "Prune invalid branches as early as possible to cut the search tree."],
    questions: [
      q("bt-subsets", "Subsets", "Medium",
        "Return all subsets of a set of distinct integers.",
        ["Backtracking"], "Take/skip each element recursively.",
        `vector<vector<int>> res; vector<int> cur;\nfunction<void(int)> dfs=[&](int i){\n  if(i==n){ res.push_back(cur); return; }\n  dfs(i+1);\n  cur.push_back(a[i]); dfs(i+1); cur.pop_back();\n};\ndfs(0); return res;`, "O(2^n)", "O(n)"),
      q("bt-permutations", "Permutations", "Medium",
        "Return all permutations of distinct integers.",
        ["Backtracking"], "Swap each unused element into position.",
        `vector<vector<int>> res;\nfunction<void(int)> dfs=[&](int i){\n  if(i==n){ res.push_back(a); return; }\n  for(int j=i;j<n;j++){ swap(a[i],a[j]); dfs(i+1); swap(a[i],a[j]); }\n};\ndfs(0); return res;`, "O(n·n!)", "O(n)"),
    ],
  },
  {
    id: "divide-and-conquer",
    name: "Divide and Conquer",
    category: "Recursion & Backtracking",
    blurb: "Split into halves, solve each, merge — the shape behind merge sort & friends.",
    definition: "Break a problem into independent subproblems (usually halves), solve them recursively, and combine their results.",
    why: "Yields O(n log n) sorting/searching and many geometry/array algorithms; the 'combine' step is where the real work often lives.",
    recognitionClues: ["Problem splits cleanly into independent halves", "Sorting / merging", "\"Count across the split\" (inversions)"],
    whenToUse: ["Sorting (merge sort, quicksort)", "Problems where the answer = combine(left, right)"],
    whenNotToUse: ["Subproblems overlap heavily (use DP instead)", "No cheap way to combine results"],
    example: {
      code: `// Merge sort\nvoid msort(vector<int>& a, int l, int r) {\n  if (l >= r) return;\n  int m = (l + r) / 2;\n  msort(a, l, m); msort(a, m + 1, r);   // divide\n  merge_inplace(a, l, m, r);            // combine\n}`,
      explanation: "Sort each half independently, then merge two sorted halves in O(n) — O(n log n) overall.",
    },
    interviewNotes: ["The recurrence T(n)=2T(n/2)+O(n) ⇒ O(n log n) (Master Theorem).", "The 'combine' step distinguishes problems with the same divide shape."],
    questions: [
      q("dc-merge-sort", "Merge sort", "Medium",
        "Sort an array using merge sort.",
        ["Divide and conquer", "Sorting"], "Recurse on halves, merge sorted halves.",
        `void merge(vector<int>&a,int l,int m,int r){\n  vector<int> t; int i=l,j=m+1;\n  while(i<=m&&j<=r) t.push_back(a[i]<=a[j]?a[i++]:a[j++]);\n  while(i<=m) t.push_back(a[i++]); while(j<=r) t.push_back(a[j++]);\n  for(int k=l;k<=r;k++) a[k]=t[k-l];\n}\nvoid msort(vector<int>&a,int l,int r){ if(l>=r)return; int m=(l+r)/2; msort(a,l,m); msort(a,m+1,r); merge(a,l,m,r); }`, "O(n log n)", "O(n)"),
    ],
  },

  // ============================ OPTIMIZATION ============================
  {
    id: "greedy-pattern",
    name: "Greedy Pattern",
    category: "Optimization",
    blurb: "Take the locally-best choice at each step — when it provably gives the global optimum.",
    definition: "Build a solution by repeatedly choosing the option that looks best right now, never reconsidering past choices.",
    why: "When a greedy choice is provably safe, it's far simpler and faster (often O(n log n) with a sort) than DP or search.",
    recognitionClues: ["\"Maximum number of …\" / \"minimum cost to …\"", "Sorting by a key makes the choice obvious", "Intervals / scheduling"],
    whenToUse: ["Interval scheduling (earliest finish time)", "Huffman coding, fractional knapsack", "When an exchange argument proves greedy is optimal"],
    whenNotToUse: ["Locally-best ≠ globally-best (e.g. 0/1 knapsack — use DP)", "You can't prove the greedy choice is safe"],
    example: {
      code: `// Max non-overlapping intervals: sort by end, take greedily\nsort(iv.begin(), iv.end(), [](auto& a, auto& b){ return a.second < b.second; });\nint cnt = 0, end = INT_MIN;\nfor (auto& [s, e] : iv)\n  if (s >= end) { cnt++; end = e; }   // take if it doesn't overlap`,
      explanation: "Choosing the interval that finishes earliest leaves the most room for the rest — a provably optimal greedy choice.",
    },
    interviewNotes: ["Always justify greed with an exchange argument or a counterexample for DP.", "Most greedy solutions start with a sort."],
    questions: [
      q("greedy-intervals", "Non-overlapping intervals", "Medium",
        "Find the max number of mutually non-overlapping intervals.",
        ["Greedy", "Sorting"], "Sort by end time, take if start ≥ last end.",
        `sort(iv.begin(),iv.end(),[](auto&a,auto&b){return a[1]<b[1];});\nint cnt=0,end=INT_MIN;\nfor(auto&x:iv) if(x[0]>=end){ cnt++; end=x[1]; }\nreturn cnt;`, "O(n log n)", "O(1)"),
      q("greedy-jump", "Jump game", "Medium",
        "Each value is the max jump length from that index; can you reach the last index?",
        ["Greedy"], "Track the farthest reachable index as you scan.",
        `int far=0;\nfor(int i=0;i<n;i++){\n  if(i>far) return false;       // stuck before this index\n  far=max(far,i+a[i]);\n}\nreturn true;`, "O(n)", "O(1)"),
    ],
  },
  {
    id: "dp-patterns",
    name: "Dynamic Programming Patterns",
    category: "Optimization",
    blurb: "Cache overlapping subproblems — 1-D, 2-D, knapsack, intervals.",
    definition: "Solve a problem by combining solutions to overlapping subproblems, each computed once and stored (memoization or tabulation).",
    why: "Turns exponential recursion into polynomial time. The hard part is defining the *state* and *transition*; the rest is bookkeeping.",
    recognitionClues: ["\"Count the number of ways\" / \"min/max cost\"", "Choices at each step with overlapping futures", "Recursion tree repeats subproblems"],
    whenToUse: ["Optimal substructure + overlapping subproblems", "Knapsack, LIS, edit distance, grid paths"],
    whenNotToUse: ["Subproblems are independent (divide & conquer)", "A greedy choice is provably optimal"],
    example: {
      code: `// 0/1 Knapsack (1-D rolling array)\nvector<int> dp(W + 1, 0);\nfor (int i = 0; i < n; i++)\n  for (int w = W; w >= wt[i]; w--)             // iterate weight downward\n    dp[w] = max(dp[w], dp[w - wt[i]] + val[i]);\n// dp[W] = best value within capacity W`,
      explanation: "Iterating `w` downward ensures each item is used at most once (the 0/1 constraint).",
    },
    interviewNotes: ["Define state precisely: dp[i][w] = best using first i items, capacity w.", "Start top-down (memoized recursion), then convert to bottom-up if needed."],
    questions: [
      q("dp-climb", "Climbing stairs", "Easy",
        "Count ways to climb n stairs taking 1 or 2 steps.",
        ["DP", "1-D"], "dp[i] = dp[i-1] + dp[i-2].",
        `int a=1,b=1; for(int i=2;i<=n;i++){ int c=a+b; a=b; b=c; } return b;`, "O(n)", "O(1)"),
      q("dp-lis", "Longest increasing subsequence", "Medium",
        "Length of the longest strictly increasing subsequence.",
        ["DP", "Binary search"], "Patience sorting: keep tails[] and binary-search.",
        `vector<int> tails;\nfor(int x:a){ auto it=lower_bound(tails.begin(),tails.end(),x);\n  if(it==tails.end()) tails.push_back(x); else *it=x; }\nreturn tails.size();`, "O(n log n)", "O(n)"),
    ],
  },
  {
    id: "bit-manipulation",
    name: "Bit Manipulation Patterns",
    category: "Optimization",
    blurb: "Use bits as flags/sets — XOR tricks, masks, and subset enumeration.",
    definition: "Operate directly on the binary representation: set/clear/test bits, use an integer as a small set, exploit XOR/AND identities.",
    why: "O(1) set operations on small universes, elegant pairing tricks (XOR cancels duplicates), and bitmask DP over subsets.",
    recognitionClues: ["\"Every element appears twice except one\" (XOR)", "Small set (n ≤ ~20) → bitmask", "Count/check/toggle individual bits"],
    whenToUse: ["Subset enumeration / bitmask DP", "XOR uniqueness tricks", "Fast flags instead of a bool array"],
    whenNotToUse: ["Large universes (bitset/array is clearer)", "Readability matters more than micro-optimization"],
    example: {
      code: `// Single number: the one element appearing once\nint x = 0;\nfor (int v : a) x ^= v;   // pairs cancel (v ^ v == 0)\nreturn x;`,
      explanation: "XOR is associative and self-canceling, so duplicates vanish and only the unique value remains.",
    },
    interviewNotes: ["`x & (x-1)` clears the lowest set bit (counts bits, checks power-of-two).", "`1 << i` makes a mask; `x >> i & 1` tests bit i."],
    questions: [
      q("bit-single", "Single number", "Easy",
        "Every element appears twice except one — find it.",
        ["Bit manipulation", "XOR"], "XOR everything; pairs cancel.",
        `int x=0; for(int v:a) x^=v; return x;`),
      q("bit-count", "Count set bits", "Easy",
        "Count the number of 1-bits in an integer.",
        ["Bit manipulation"], "Clear the lowest set bit each step.",
        `int c=0; while(n){ n&=n-1; c++; } return c;`, "O(#bits)", "O(1)"),
    ],
  },

  // ========================= STACKS & QUEUES =========================
  {
    id: "monotonic-stack",
    name: "Monotonic Stack",
    category: "Stacks & Queues",
    blurb: "A stack kept sorted — next/previous greater element in O(n).",
    definition: "A stack whose elements stay in increasing or decreasing order; pushing pops everything that violates the order, each element entering/leaving once.",
    why: "Answers 'next greater / previous smaller element' and many histogram/span problems in O(n) instead of O(n²).",
    recognitionClues: ["\"Next greater / smaller element\"", "\"Largest rectangle / span\"", "\"Days until a warmer temperature\""],
    whenToUse: ["Nearest larger/smaller in a direction", "Histogram area, stock span, temperatures"],
    whenNotToUse: ["No monotonic relationship between elements", "Random access / range queries (use other structures)"],
    example: {
      code: `// Next greater element to the right (indices)\nvector<int> ans(n, -1);\nstack<int> st;                 // indices, values decreasing\nfor (int i = 0; i < n; i++) {\n  while (!st.empty() && a[st.top()] < a[i]) {\n    ans[st.top()] = a[i]; st.pop();\n  }\n  st.push(i);\n}`,
      explanation: "Each index is pushed and popped at most once, so the whole scan is O(n) despite the inner while.",
    },
    interviewNotes: ["Decide direction (left/right) and order (increasing/decreasing) up front.", "Store indices, not values, when you need positions/distances."],
    questions: [
      q("ms-next-greater", "Next greater element", "Medium",
        "For each element, find the next element to its right that is greater.",
        ["Monotonic stack"], "Pop smaller elements as you advance.",
        `vector<int> ans(n,-1); stack<int> st;\nfor(int i=0;i<n;i++){ while(!st.empty()&&a[st.top()]<a[i]){ ans[st.top()]=a[i]; st.pop(); } st.push(i); }\nreturn ans;`, "O(n)", "O(n)"),
      q("ms-hist", "Largest rectangle in histogram", "Hard",
        "Max rectangular area under a histogram of bar heights.",
        ["Monotonic stack"], "Pop when a shorter bar arrives; width spans the popped region.",
        `stack<int> st; int best=0; heights.push_back(0);\nfor(int i=0;i<(int)heights.size();i++){\n  while(!st.empty()&&heights[st.top()]>=heights[i]){\n    int h=heights[st.top()]; st.pop();\n    int w=st.empty()?i:i-st.top()-1; best=max(best,h*w);\n  } st.push(i);\n}\nreturn best;`, "O(n)", "O(n)"),
    ],
  },
  {
    id: "heap-pattern",
    name: "Heap / Priority Queue",
    category: "Stacks & Queues",
    blurb: "Always-on access to the min or max — top-k, merging, scheduling.",
    definition: "A binary heap gives O(log n) insert and O(1) peek of the smallest (or largest) element; C++ `priority_queue` is a max-heap by default.",
    why: "When you repeatedly need the current best element (top-k, k-way merge, Dijkstra), a heap beats re-sorting every time.",
    recognitionClues: ["\"K largest / smallest / closest\"", "\"Merge k sorted …\"", "Repeatedly pull the min/max (Dijkstra, scheduling)"],
    whenToUse: ["Top-k selection", "K-way merge, median of a stream", "Greedy where you always take the current extreme"],
    whenNotToUse: ["You need the full sorted order once (just sort)", "Random access by index"],
    example: {
      code: `// K largest elements: keep a min-heap of size k\npriority_queue<int, vector<int>, greater<int>> pq;  // min-heap\nfor (int x : a) {\n  pq.push(x);\n  if ((int)pq.size() > k) pq.pop();   // drop the smallest\n}\n// pq holds the k largest`,
      explanation: "A size-k min-heap keeps the k largest seen so far in O(n log k) — cheaper than sorting all n.",
    },
    interviewNotes: ["For k *largest*, use a *min*-heap of size k (and vice-versa).", "`priority_queue` is a max-heap by default; pass `greater<>` for a min-heap."],
    questions: [
      q("heap-kth-largest", "Kth largest element", "Medium",
        "Return the k-th largest element in an array.",
        ["Heap"], "Maintain a size-k min-heap.",
        `priority_queue<int,vector<int>,greater<int>> pq;\nfor(int x:a){ pq.push(x); if((int)pq.size()>k) pq.pop(); }\nreturn pq.top();`, "O(n log k)", "O(k)"),
      q("heap-merge-k", "Merge k sorted lists", "Hard",
        "Merge k sorted linked lists into one sorted list.",
        ["Heap"], "Min-heap of the current head of each list; pop the smallest, push its next.",
        `priority_queue<pair<int,Node*>,vector<pair<int,Node*>>,greater<>> pq;\nfor(auto* l:lists) if(l) pq.push({l->val,l});\nNode dummy(0), *t=&dummy;\nwhile(!pq.empty()){ auto [v,n]=pq.top(); pq.pop();\n  t->next=n; t=n; if(n->next) pq.push({n->next->val,n->next}); }\nreturn dummy.next;`, "O(N log k)", "O(k)"),
    ],
  },

  // ========================== TREES & GRAPHS ==========================
  {
    id: "tree-dfs",
    name: "Tree DFS",
    category: "Trees & Graphs",
    blurb: "Go deep first — pre/in/post order, height, path sums.",
    definition: "Depth-first traversal of a tree via recursion (or an explicit stack), visiting a node and then its children before siblings.",
    why: "Most tree questions (height, diameter, path sums, validation) are a single DFS that returns info up from children.",
    recognitionClues: ["Binary/N-ary tree input", "\"Path from root to leaf\"", "Answer combines results from subtrees"],
    whenToUse: ["Compute per-subtree info (height, sum, count)", "Validate structure (BST check)", "Root-to-leaf paths"],
    whenNotToUse: ["Shortest path by edge count (use BFS)", "Tree is so deep recursion overflows (use an explicit stack)"],
    example: {
      code: `// Height of a binary tree\nint height(Node* r) {\n  if (!r) return 0;\n  return 1 + max(height(r->left), height(r->right));\n}`,
      explanation: "Classic post-order: each node's answer is built from its children's answers.",
    },
    interviewNotes: ["Pick the traversal order by what you need: in-order on a BST yields sorted values.", "Return rich info up the recursion (e.g. height) to compute global answers like diameter."],
    questions: [
      q("td-max-depth", "Maximum depth of binary tree", "Easy",
        "Return the maximum depth (height) of a binary tree.",
        ["Tree DFS", "Recursion"], "1 + max(left, right).",
        `int depth(Node* r){ return r ? 1+max(depth(r->left),depth(r->right)) : 0; }`, "O(n)", "O(h)"),
      q("td-inorder", "Inorder traversal", "Easy",
        "Return the in-order traversal (left, node, right) of a binary tree.",
        ["Tree DFS"], "Recurse left, visit, recurse right — sorted order on a BST.",
        `void inorder(Node* r, vector<int>& out){\n  if(!r) return;\n  inorder(r->left,out);\n  out.push_back(r->val);\n  inorder(r->right,out);\n}`, "O(n)", "O(h)"),
    ],
  },
  {
    id: "tree-bfs",
    name: "Tree BFS",
    category: "Trees & Graphs",
    blurb: "Level-by-level traversal with a queue — level order, right view, min depth.",
    definition: "Breadth-first traversal that processes a tree level by level using a queue, expanding all nodes at depth d before depth d+1.",
    why: "Any 'per level' or 'shortest in terms of levels' tree question is a clean BFS — far simpler than threading levels through DFS.",
    recognitionClues: ["\"Level order\" / \"per level\"", "\"Right/left side view\"", "\"Minimum depth\""],
    whenToUse: ["Level-order output", "Shallowest leaf / min depth", "Per-level aggregates (averages, max)"],
    whenNotToUse: ["Per-subtree info bubbling up (DFS is natural)", "Memory tight + very wide tree (the queue holds a whole level)"],
    example: {
      code: `// Level-order traversal\nvector<vector<int>> levels;\nqueue<Node*> qz; if (root) qz.push(root);\nwhile (!qz.empty()) {\n  int sz = qz.size(); vector<int> lvl;\n  for (int i = 0; i < sz; i++) {\n    Node* n = qz.front(); qz.pop(); lvl.push_back(n->val);\n    if (n->left) qz.push(n->left);\n    if (n->right) qz.push(n->right);\n  }\n  levels.push_back(lvl);\n}`,
      explanation: "Snapshotting `sz = queue size` before the inner loop isolates exactly one level per outer iteration.",
    },
    interviewNotes: ["Capture the level size before draining the queue.", "The last node dequeued per level is the right-side view."],
    questions: [
      q("tb-level-order", "Binary tree level order", "Medium",
        "Return node values grouped by level (top to bottom).",
        ["Tree BFS", "Queue"], "Process one level per outer iteration.",
        `vector<vector<int>> res; queue<Node*> q; if(root) q.push(root);\nwhile(!q.empty()){ int s=q.size(); vector<int> lvl;\n  while(s--){ auto n=q.front(); q.pop(); lvl.push_back(n->val);\n    if(n->left)q.push(n->left); if(n->right)q.push(n->right); }\n  res.push_back(lvl); }\nreturn res;`, "O(n)", "O(n)"),
    ],
  },
  {
    id: "graph-dfs",
    name: "Graph DFS",
    category: "Trees & Graphs",
    blurb: "Explore connectivity deeply — components, cycles, flood fill.",
    definition: "Depth-first exploration of a graph with a `visited` set to avoid revisiting, recursing (or stacking) along edges as far as possible.",
    why: "Connected components, cycle detection, flood fill, and path existence are all short DFS variants.",
    recognitionClues: ["Grid/graph connectivity (\"number of islands\")", "\"Is there a path / cycle\"", "Explore a region fully"],
    whenToUse: ["Count connected components", "Flood fill / region marking", "Cycle detection (with recursion stack)"],
    whenNotToUse: ["Shortest path in an unweighted graph (use BFS)", "Huge depth that overflows the call stack"],
    example: {
      code: `// Number of islands (grid DFS / flood fill)\nvoid dfs(int r, int c, vector<vector<char>>& g) {\n  if (r < 0 || c < 0 || r >= R || c >= C || g[r][c] != '1') return;\n  g[r][c] = '0';                       // mark visited\n  dfs(r+1,c,g); dfs(r-1,c,g);\n  dfs(r,c+1,g); dfs(r,c-1,g);\n}\n// count: for each unvisited '1', dfs() and ++count`,
      explanation: "Each DFS sinks one entire island; the number of DFS launches equals the island count.",
    },
    interviewNotes: ["A grid is an implicit graph — neighbors are the 4 (or 8) adjacent cells.", "Mark visited *as you enter* to avoid infinite loops on cycles."],
    questions: [
      q("gd-islands", "Number of islands", "Medium",
        "Count connected groups of '1' cells (4-directional) in a grid.",
        ["Graph DFS", "Flood fill"], "DFS from each unvisited land cell, sinking it.",
        `int count=0;\nfor(int r=0;r<R;r++) for(int c=0;c<C;c++)\n  if(g[r][c]=='1'){ dfs(r,c,g); count++; }\nreturn count;`, "O(R·C)", "O(R·C)"),
      q("gd-cycle-undirected", "Detect cycle (undirected)", "Medium",
        "Detect whether an undirected graph contains a cycle.",
        ["Graph DFS"], "DFS tracking the parent; a visited non-parent neighbor means a cycle.",
        `function<bool(int,int)> dfs=[&](int u,int par)->bool{\n  vis[u]=true;\n  for(int v:adj[u]){\n    if(!vis[v]){ if(dfs(v,u)) return true; }\n    else if(v!=par) return true;   // back-edge\n  }\n  return false;\n};`, "O(V+E)", "O(V)"),
    ],
  },
  {
    id: "graph-bfs",
    name: "Graph BFS",
    category: "Trees & Graphs",
    blurb: "Shortest paths in unweighted graphs — fewest edges, level by level.",
    definition: "Breadth-first exploration from a source using a queue; the first time a node is reached is via a shortest (fewest-edge) path.",
    why: "The standard tool for shortest path / minimum steps in unweighted graphs and grids (mazes, word ladders, multi-source spread).",
    recognitionClues: ["\"Minimum steps / shortest path\" in an unweighted graph", "Spreading process (rotting oranges, infection)", "Maze / grid distance"],
    whenToUse: ["Shortest path by edge count", "Multi-source spread (push all sources first)", "Level/distance from a source"],
    whenNotToUse: ["Weighted edges (use Dijkstra/0-1 BFS)", "You only need reachability, not distance (DFS is fine)"],
    example: {
      code: `// Shortest distance from src in an unweighted graph\nvector<int> dist(n, -1); queue<int> qz;\ndist[src] = 0; qz.push(src);\nwhile (!qz.empty()) {\n  int u = qz.front(); qz.pop();\n  for (int v : adj[u])\n    if (dist[v] == -1) { dist[v] = dist[u] + 1; qz.push(v); }\n}`,
      explanation: "Setting `dist` when you enqueue (not dequeue) guarantees each node is recorded with its shortest distance once.",
    },
    interviewNotes: ["Mark visited at enqueue time, not dequeue, to avoid duplicates in the queue.", "Multi-source BFS: push all sources with dist 0 before the loop."],
    questions: [
      q("gb-rotting", "Rotting oranges", "Medium",
        "Minutes until all fresh oranges rot (4-directional spread from rotten ones).",
        ["Graph BFS", "Multi-source"], "Push all rotten cells first; BFS counts minutes.",
        `queue<pair<int,int>> q; int fresh=0;\nfor(int r=0;r<R;r++) for(int c=0;c<C;c++){\n  if(g[r][c]==2) q.push({r,c}); else if(g[r][c]==1) fresh++; }\nint mins=0;\nwhile(!q.empty()&&fresh){ int s=q.size(); mins++;\n  while(s--){ auto [r,c]=q.front(); q.pop();\n    for(auto[dr,dc]:dirs){ int nr=r+dr,nc=c+dc;\n      if(nr>=0&&nc>=0&&nr<R&&nc<C&&g[nr][nc]==1){ g[nr][nc]=2; fresh--; q.push({nr,nc}); } } } }\nreturn fresh?-1:mins;`, "O(R·C)", "O(R·C)"),
    ],
  },
  {
    id: "topological-sort",
    name: "Topological Sort",
    category: "Trees & Graphs",
    blurb: "Order tasks so every dependency comes first — DAG scheduling.",
    definition: "A linear ordering of a directed acyclic graph's vertices such that every edge u→v has u before v; computed via Kahn's BFS (indegrees) or DFS post-order.",
    why: "Solves dependency resolution: course schedules, build systems, task ordering — and detects cycles (no valid order ⇒ a cycle exists).",
    recognitionClues: ["\"Order with prerequisites / dependencies\"", "\"Can you finish all courses\"", "Directed graph that should be acyclic"],
    whenToUse: ["Scheduling with prerequisites", "Detecting cycles in a directed graph", "Build/compile ordering"],
    whenNotToUse: ["Undirected graphs", "The graph has cycles by design"],
    example: {
      code: `// Kahn's algorithm (BFS on indegrees)\nqueue<int> qz;\nfor (int i = 0; i < n; i++) if (indeg[i] == 0) qz.push(i);\nvector<int> order;\nwhile (!qz.empty()) {\n  int u = qz.front(); qz.pop(); order.push_back(u);\n  for (int v : adj[u]) if (--indeg[v] == 0) qz.push(v);\n}\nif ((int)order.size() != n) { /* cycle — no valid order */ }`,
      explanation: "Repeatedly remove a node with no remaining prerequisites; if you can't place all n, there's a cycle.",
    },
    interviewNotes: ["order.size() < n ⇒ the graph has a cycle.", "Kahn's (BFS) is usually easier to reason about than DFS post-order."],
    questions: [
      q("ts-course-schedule", "Course schedule", "Medium",
        "Given prerequisites, decide if all courses can be finished (no cycle).",
        ["Topological sort", "Graph BFS"], "Kahn's algorithm; check all nodes get ordered.",
        `vector<int> indeg(n,0);\nfor(auto&e:pre){ adj[e[1]].push_back(e[0]); indeg[e[0]]++; }\nqueue<int> q; for(int i=0;i<n;i++) if(!indeg[i]) q.push(i);\nint seen=0;\nwhile(!q.empty()){ int u=q.front();q.pop(); seen++;\n  for(int v:adj[u]) if(--indeg[v]==0) q.push(v); }\nreturn seen==n;`, "O(V+E)", "O(V+E)"),
    ],
  },
  {
    id: "union-find",
    name: "Union Find (DSU)",
    category: "Trees & Graphs",
    blurb: "Near-O(1) merge & connectivity queries — components, cycles, Kruskal.",
    definition: "A disjoint-set structure with `find` (representative of a set) and `union` (merge two sets), optimized by path compression + union by rank.",
    why: "Answers 'are these connected?' and merges groups almost in constant time — ideal for dynamic connectivity and Kruskal's MST.",
    recognitionClues: ["\"Connected components\" with incremental merges", "\"Detect a cycle\" in an undirected graph", "Grouping equivalent items"],
    whenToUse: ["Dynamic connectivity (edges added over time)", "Kruskal's minimum spanning tree", "Grouping / equivalence classes"],
    whenNotToUse: ["You need to *remove* edges (DSU isn't designed for deletions)", "Shortest paths / distances"],
    example: {
      code: `int parent[N], rnk[N];\nint find(int x){ return parent[x]==x ? x : parent[x]=find(parent[x]); } // path compression\nbool uni(int a, int b){\n  a=find(a); b=find(b); if(a==b) return false;   // already connected\n  if(rnk[a]<rnk[b]) swap(a,b);\n  parent[b]=a; if(rnk[a]==rnk[b]) rnk[a]++;\n  return true;\n}`,
      explanation: "Path compression flattens the tree during find; union by rank keeps it shallow — together near O(1) amortized.",
    },
    interviewNotes: ["`uni` returning false means the two were already connected ⇒ adding this edge forms a cycle.", "Initialize parent[i]=i for every node."],
    questions: [
      q("uf-redundant", "Redundant connection", "Medium",
        "In a graph that was a tree plus one extra edge, find the edge that creates a cycle.",
        ["Union find"], "The first edge whose endpoints already share a root is the answer.",
        `for(auto&e:edges){ if(!uni(e[0],e[1])) return e; }\nreturn {};`, "O(E·α)", "O(N)"),
    ],
  },

  // ============================== ADVANCED ==============================
  {
    id: "segment-tree",
    name: "Segment Tree",
    category: "Advanced",
    blurb: "Range queries + point updates in O(log n) on a mutable array.",
    definition: "A binary tree over array ranges where each node stores an aggregate (sum/min/max) of its segment, supporting query and update in O(log n).",
    why: "When the array changes between range queries, prefix sums fail; a segment tree (or Fenwick) keeps both fast.",
    recognitionClues: ["Range query (sum/min/max) AND updates interleaved", "\"After each update, report …\"", "Mutable array with many queries"],
    whenToUse: ["Dynamic range sum/min/max", "Range-update + range-query (with lazy propagation)"],
    whenNotToUse: ["Array is static (prefix sums are simpler)", "Only point queries (a plain array suffices)"],
    example: {
      code: `// Build + point-update + range-sum (iterative segment tree)\nint seg[2*N], n;\nvoid build(vector<int>& a){ n=a.size(); for(int i=0;i<n;i++) seg[n+i]=a[i];\n  for(int i=n-1;i>0;i--) seg[i]=seg[2*i]+seg[2*i+1]; }\nvoid update(int i,int v){ for(seg[i+=n]=v; i>1; i>>=1) seg[i>>1]=seg[i]+seg[i^1]; }\nint query(int l,int r){ int s=0; for(l+=n,r+=n+1; l<r; l>>=1,r>>=1){\n  if(l&1) s+=seg[l++]; if(r&1) s+=seg[--r]; } return s; }`,
      explanation: "The iterative form stores leaves at [n, 2n) and merges children upward; queries climb from the leaves.",
    },
    interviewNotes: ["For range updates, add lazy propagation.", "A Fenwick (BIT) tree is simpler when you only need prefix sums."],
    questions: [
      q("seg-range-sum-mutable", "Range sum query — mutable", "Medium",
        "Support update(i, val) and sumRange(l, r) on an array.",
        ["Segment tree"], "Build a segment tree; update and query in O(log n).",
        `// build(a); update(i,v); query(l,r) as above\n// each operation is O(log n)`, "O(log n) per op", "O(n)"),
    ],
  },
  {
    id: "trie",
    name: "Trie (Prefix Tree)",
    category: "Advanced",
    blurb: "A tree keyed by characters — fast prefix search & autocomplete.",
    definition: "A tree where each edge is a character and each root-to-node path spells a prefix; words are inserted and searched character by character.",
    why: "O(L) insert/search by word length (independent of dictionary size), and natural prefix queries (autocomplete, longest common prefix, word search).",
    recognitionClues: ["\"Prefix\" / \"starts with\" / autocomplete", "Many words sharing prefixes", "Word search on a board"],
    whenToUse: ["Prefix lookups / autocomplete", "Dictionary membership with shared prefixes", "Bitwise tries for max-XOR"],
    whenNotToUse: ["A hash set suffices (no prefix queries)", "Memory is tight and words share few prefixes"],
    example: {
      code: `struct Trie {\n  Trie* next[26] = {};\n  bool end = false;\n  void insert(const string& w){\n    Trie* cur = this;\n    for(char c : w){ int i=c-'a'; if(!cur->next[i]) cur->next[i]=new Trie(); cur=cur->next[i]; }\n    cur->end = true;\n  }\n};`,
      explanation: "Each character walks (or creates) one edge; `end` marks where a complete word finishes.",
    },
    interviewNotes: ["Search/insert is O(word length), not O(dictionary size).", "Store a count per node for prefix-frequency queries."],
    questions: [
      q("trie-implement", "Implement Trie", "Medium",
        "Support insert(word), search(word), and startsWith(prefix).",
        ["Trie"], "Walk children per character; mark word ends.",
        `// insert: create missing child nodes, set end=true at the last\n// search: walk; true only if the final node's end is set\n// startsWith: walk; true if the path exists`, "O(L) per op", "O(total chars)"),
      q("trie-startswith-count", "Count words with prefix", "Medium",
        "After inserting words, return how many stored words start with a given prefix.",
        ["Trie"], "Store a counter at each node, incremented on every insert that passes through.",
        `// On insert: cur->cnt++ at every node along the word.\n// countPrefix(p): walk p; return the final node's cnt (0 if the path breaks).`, "O(L) per op", "O(total chars)"),
    ],
  },
  {
    id: "cp-tricks",
    name: "Competitive Programming Tricks",
    category: "Advanced",
    blurb: "The small high-leverage habits: modular arithmetic, overflow, complexity budgeting.",
    definition: "A grab-bag of CP fundamentals: modular arithmetic, overflow safety, estimating the algorithm your time limit allows, and precomputation.",
    why: "Most CP failures aren't the algorithm — they're overflow, a wrong modulo, or picking an O(n²) when n=10^5. These habits prevent silent wrong-answers.",
    recognitionClues: ["\"Answer modulo 1e9+7\"", "Large constraints (10^5, 10^6, 10^9)", "Sums/products that overflow 32-bit ints"],
    whenToUse: ["Any competitive contest", "Estimating feasibility from constraints before coding"],
    whenNotToUse: ["Interview problems usually don't need modular arithmetic / overflow gymnastics"],
    example: {
      code: `const long long MOD = 1e9 + 7;\nlong long add(long long a, long long b){ return (a + b) % MOD; }\nlong long mul(long long a, long long b){ return (a % MOD) * (b % MOD) % MOD; }\n// Complexity budget: ~10^8 simple ops per second.\n// n=10^5 ⇒ O(n log n) ok, O(n^2)=10^10 too slow.`,
      explanation: "Reduce after every multiply to stay in range, and budget complexity from n before choosing an approach.",
    },
    interviewNotes: ["Use `long long` for any sum/product that might exceed ~2·10^9.", "From n, infer the target complexity: n≤20 → exponential ok; n≤10^3 → O(n²); n≤10^6 → O(n log n)."],
    questions: [
      q("cp-modpow", "Modular exponentiation", "Medium",
        "Compute (base^exp) mod 1e9+7 efficiently.",
        ["CP tricks", "Math"], "Fast exponentiation by squaring.",
        `long long power(long long b,long long e,long long m){\n  long long r=1; b%=m;\n  while(e){ if(e&1) r=r*b%m; b=b*b%m; e>>=1; }\n  return r;\n}`, "O(log e)", "O(1)"),
    ],
  },
];

// ----------------------------- Derived helpers -----------------------------
export const getPattern = (id: string): Pattern | undefined => PATTERNS.find((p) => p.id === id);
export const PATTERNS_ORDERED = PATTERNS;
export const TOTAL_PATTERNS = PATTERNS.length;
export const TOTAL_PATTERN_QUESTIONS = PATTERNS.reduce((n, p) => n + p.questions.length, 0);
export function patternsByCategory(): { category: string; patterns: Pattern[] }[] {
  return PATTERN_CATEGORIES.map((category) => ({
    category,
    patterns: PATTERNS.filter((p) => p.category === category),
  })).filter((g) => g.patterns.length > 0);
}
